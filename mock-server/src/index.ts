import express from 'express';
import cors from 'cors';
import { apiInitializeWithRouter } from './api';
import { csrfMiddleware } from './csrf';
import path from 'path';
import bodyParser from 'body-parser';
const router = express.Router()

const API_DELAY_MS = 0;

const app = express();
app.use(cors({
    origin: '*',
}))

// Host built website as well
if (process.env["HOST_STATIC"]) {
    console.log("Hosting static files from " + process.env["HOST_STATIC"]);
    app.use(express.static(process.env["HOST_STATIC"]));
} else {
    // Check Token
    app.use(csrfMiddleware);
}


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Artificial Delay
app.use((req, res, next) => {
    setTimeout(next, API_DELAY_MS);
});

// Check for json header
app.use((req, res, next) => {
    if (req.get('Accept') === 'application/json' || process.env["HOST_STATIC"]) {
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

// 404
app.use((req, res, next) => {
    if (process.env["HOST_STATIC"]) {
        res.sendFile(path.join(__dirname, "../", process.env["HOST_STATIC"], 'index.html'));
        return
    }
    next();
});

console.log("MOCK SERVER - Listening on http://localhost:8080/")
app.listen(8080)
