import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 3,
    duration: '20s',
    thresholds: {
        http_req_failed: ['rate<0.05'],
        http_req_duration: ['p(95)<2000'],
    },
};

const BASE_URL = 'http://localhost:3001';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNWMzNzgzYS02MDU5LTQ2NTYtYmE2Mi1hMjQ4YzQ4ZDQ0OWYiLCJlbWFpbCI6InRlc3QyQHRlc3QuY29tIiwicm9sZSI6ImNpdGl6ZW4iLCJpYXQiOjE3NzY1MjA0NDUsImV4cCI6MTc3NjYwNjg0NX0.-4fGPiu5TKOkE4Q8PuyJVT-cKVG2-XtCKpV8meWjQC4';

function buildUrl(i) {
    const originLat = i % 2 === 0 ? 32.179 : 32.1791;

    return (
        `${BASE_URL}/api/v1/routes/estimate` +
        `?origin_lat=${originLat}` +
        `&origin_lng=35.258` +
        `&dest_lat=32.150` +
        `&dest_lng=35.280` +
        `&avoid_checkpoints=true` +
        `&avoid_areas=Nablus`
    );
}

export default function () {
    const url = buildUrl(__ITER);

    const params = {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    };

    const res = http.get(url, params);

    if (res.status !== 200) {
        console.log(`FAIL STATUS: ${res.status} BODY: ${res.body}`);
    }

    check(res, {
        'status is 200': (r) => r.status === 200,
        'has route data': (r) => {
            try {
                const body = JSON.parse(r.body);
                return (
                    body.distance_meters !== undefined &&
                    body.duration_seconds !== undefined &&
                    body.metadata !== undefined
                );
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}