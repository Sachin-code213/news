import express from 'express';
const router = express.Router();

router.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    // In a real app, you'd save this to a 'Subscribers' collection
    console.log(`New Subscriber: ${email}`);
    res.status(200).json({ success: true, message: "Welcome to the inner circle!" });
});

export default router;