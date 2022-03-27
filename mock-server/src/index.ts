import express from 'express';
import cors from 'cors';
import { apiInitializeWithRouter } from './api';
import { csrfMiddleware } from './csrf';
const router = express.Router()

const API_DELAY_MS = 1000;

const app = express();
app.use(cors({
    origin: '*',
}))
app.use(express.json());

// Artificial Delay
app.use((req, res, next) => {
    setTimeout(next, API_DELAY_MS);
});

// Check Token
app.use(csrfMiddleware);

// Check for json header
app.use(function (req, res, next) {
    if (req.get('Accept') === 'application/json') {
        next()
    } else {
        res.status(406).json({
            error: "Only JSON responses are supported"
        });
    }
})

app.use("/",router)

router.get('/', (req, res) => {
    res.json({message: "Hello World"});
});

router.get('/alive', (req, res) => {
    res.json({message: "alive"});
});

apiInitializeWithRouter(router)

console.log("MOCK SERVER - Listening on http://localhost:8080/")
app.listen(8080)
