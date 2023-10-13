## Installation

```bash
$ yarn install
```

### Seeding Data
```bash
$ yarn seed
```

### Running the Scheduler
```bash
$ yarn jobs:run
```

## Running the application server

```bash
# production
$ yarn start

# watch mode
$ yarn start:dev
```

## API Documentation
The API documentation will be available at the URL:
```bash
/api-docs
```

You can download the API specification as a JSON file on the following URL:
```bash
/api-docs-json
```

#### Postman Test Script
You can use the following Postman test script to set your auth token after a successful **'/auth/login'** API call:
```bash
const jsonData = JSON.parse(responseBody);
pm.test('Status code is 200', () => {
    pm.response.to.have.status(200);
});
pm.environment.set('access_token', `Bearer ${jsonData.token}`);
```