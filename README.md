# Key Value Storage with Time Revision

Key Value store with time revision - VD test.

## Production code base.

1. Routing for managing API end points.
2. Controller to handle API request and input filtering.
3. Model for abstraction on MongoDB.
4. Modular design to further abstract the responsibility of each module. 
5. Logging to files for debugging and inspection on production server.
6. Test cases to ensure code and application reliability.
7. Indexes on key and timestamp to improve MongoDB query performance.
8. Configured logging base on environment between developement and production.

## Usage

Starting server
```DEBUG=key-val-store:* npm start```

Running test cases
```npm test```

Adding key
```curl -d '{"MyKey":"My Value"}' -H "Content-Type: application/json" http://127.0.0.1:3000/objects```

Retrieving key
curl http://127.0.0.1:3000/objects/MyKey

Retrieving key by timestamp
curl http://127.0.0.1:3000/objects/MyKey?timestamp=1484477495

## Known Limitation

2 Key added within a same second will only return one of them upon query the key.