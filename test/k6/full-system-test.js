import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3001';

export const options = {
    scenarios: {
        mixed: {
            executor: 'constant-vus',
            vus: 5,
            duration: '30s',
        },
    },
};

//users:
const userCreds = {
    email: 'user@test.com',
    password: '12345678',
};

const adminCreds = {
    email: 'admin@test.com',
    password: '12345678',
};

//ids:
const reportId = '7efe73dc-b1d5-4d81-9f37-36b653dab5';
const incidentId = '869fda3c-a609-4df5-b272-4059d209bc3b';
const checkpointId = '7e9e9b63-5103-475c-926a-02e5aa081ffb';

//login function:
function login(creds) {
    const res = http.post(`${BASE_URL}/api/v1/auth/login`, JSON.stringify(creds), {
        headers: { 'Content-Type': 'application/json' },
    });

    const body = JSON.parse(res.body);
    return body.access_token;
}

//main:
export default function () {
    const userToken = login(userCreds);
    const adminToken = login(adminCreds);

    const userHeaders = {
        headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
        },
    };

    const adminHeaders = {
        headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
        },
    };

    //READ HEAVY:

    let res = http.get(`${BASE_URL}/api/v1/reports`);
    check(res, { 'GET reports': (r) => r.status === 200 });

    res = http.get(`${BASE_URL}/api/v1/incidents`);
    check(res, { 'GET incidents': (r) => r.status === 200 });

    res = http.get(`${BASE_URL}/api/v1/checkpoints`);
    check(res, { 'GET checkpoints': (r) => r.status === 200 });

    res = http.get(`${BASE_URL}/api/v1/routes/estimate?origin_lat=32.179&origin_lng=35.258&dest_lat=32.15&dest_lng=35.28`, userHeaders);
    check(res, { 'GET route': (r) => r.status === 200 });


    //WRITE HEAVY:

    //create report
    res = http.post(
        `${BASE_URL}/api/v1/reports`,
        JSON.stringify({
            user_id: 'e56876cc-0758-4422-822f-405378c44f67',
            latitude: 32.22,
            longitude: 35.25,
            category: 'delay',
            description: 'Test report from k6',
            region: 'Nablus',
        }),
        userHeaders
    );
    check(res, { 'POST report': (r) => r.status === 201 });

    //verify incident (admin)
    if (__ITER % 10 === 0) {
        res = http.patch(
            `${BASE_URL}/api/v1/incidents/${incidentId}/verify`,
            JSON.stringify({ reason: 'k6 test' }),
            adminHeaders
        );

        check(res, {
            'PATCH incident verify': (r) =>
                r.status === 200 || r.status === 400,
        });
    }


    //ALERTS:
    res = http.post(
        `${BASE_URL}/api/v1/alerts/subscriptions`,
        JSON.stringify({
            area_name: 'Nablus',
            category: 'delay',
        }),
        userHeaders
    );
    check(res, { 'POST alert sub': (r) => r.status === 201 });

    res = http.get(`${BASE_URL}/api/v1/alerts`, userHeaders);
    check(res, { 'GET alerts': (r) => r.status === 200 });

    sleep(1);
}