import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3001';

export const options = {
    scenarios: {
        writeHeavy: {
            executor: 'constant-vus',
            vus: 5,
            duration: '30s',
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
            'Content-Type': 'application/json',
        },
    };

    let res;

    // Create Report
    res = http.post(
        `${BASE_URL}/api/v1/reports`,
        JSON.stringify({
            user_id: 'e56876cc-0758-4422-822f-405378c44f67',
            latitude: 32.22,
            longitude: 35.25,
            category: 'delay',
            description: 'Write-heavy k6 test',
            region: 'Nablus',
        }),
        headers
    );

    check(res, {
        'POST report': (r) => r.status === 201,
    });

    // Create Alert Subscription
    res = http.post(
        `${BASE_URL}/api/v1/alerts/subscriptions`,
        JSON.stringify({
            area_name: 'Nablus',
            category: 'delay',
        }),
        headers
    );

    check(res, {
        'POST alert': (r) => r.status === 201,
    });

    sleep(1);
}