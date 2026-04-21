import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3001';

export const options = {
    scenarios: {
        spike: {
            executor: 'ramping-vus',
            startVUs: 1,
            stages: [
                { duration: '10s', target: 1 },
                { duration: '5s', target: 20 },
                { duration: '10s', target: 20 },
                { duration: '5s', target: 1 },
            ],
            gracefulRampDown: '5s',
        },
    },
};

const userCreds = {
    email: 'user@test.com',
    password: '12345678',
};

function login() {
    const res = http.post(
        `${BASE_URL}/api/v1/auth/login`,
        JSON.stringify(userCreds),
        { headers: { 'Content-Type': 'application/json' } }
    );

    return JSON.parse(res.body).access_token;
}

export default function () {
    const token = login();

    const headers = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    let res;

    res = http.get(`${BASE_URL}/api/v1/reports`);
    check(res, { 'GET reports': (r) => r.status === 200 });

    res = http.get(`${BASE_URL}/api/v1/incidents`);
    check(res, { 'GET incidents': (r) => r.status === 200 });

    res = http.get(
        `${BASE_URL}/api/v1/routes/estimate?origin_lat=32.179&origin_lng=35.258&dest_lat=32.15&dest_lng=35.28`,
        headers
    );
    check(res, { 'GET route': (r) => r.status === 200 });

    sleep(1);
}