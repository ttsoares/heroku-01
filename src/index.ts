import express, {Request, Response} from 'express';
import 'dotenv/config' 

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const port = process.env.PORT || 7777

app.listen(port, () => {
	console.log(`Server up on PORT ${port}`)
});
