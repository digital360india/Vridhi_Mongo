import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import userRouter from './routes/user.routes.js';
import transactionRouter from './routes/transaction.routes.js';
import unitRouter from './routes/unit.routes.js';
import noOfUsersRouter from './routes/noOfUsers.routes.js';
import Unit from './mongodb/models/unit.js';
import User from './mongodb/models/user.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', ( req, res ) => {
    res.send({ message: 'Heyy!!' });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/units', unitRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/currentPrice', noOfUsersRouter);

//2592000000 milliseconds in 30 days

const startServer = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(8080, () => console.log('Server started on port http://localhost:8080'));

        setInterval(async () => {
            const now = new Date();
            const units = await Unit.find({});
            for (const unit of units) {
                const profitGenerated = Number.parseInt((now - unit.Purchase_Date) / 2592000000) * 100;
                await Unit.updateOne({ _id: unit._id }, { $set: { Profit_Generated: profitGenerated } });
            }
            console.log(`Units updated at ${now}`);
            const users = await User.find({});
            for (const user of users) {
                let sum =0;
                const units = user.Units;
                for (let i = 0; i < user.No_of_Units; i++) {
                    const newUnit = await Unit.findOne({ _id: units[i] });
                    sum += newUnit.Profit_Generated;
                }
                console.log(sum);
                await User.updateOne({ _id: user._id }, { $set: { Profit: sum, Wallet: user.Basic+user.Profit } });
            }

        }, 1800000);
    } catch (error) {
        console.log(error);
    }
};

startServer();