import User from '../models/User';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
};

// @desc    Register new user
export const registerUser = async (req: any, res: any) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: (await User.countDocuments({})) === 0 ? 'admin' : 'user'
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id.toString()),
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Auth user & get token
export const loginUser = async (req: any, res: any) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            success: true,
            token: generateToken(user._id.toString()),
            user: { _id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
};

// @desc    Get all users (Admin Only)
export const getUsers = async (req: any, res: any) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
}; // <-- Closed properly here

// @desc    Update user role
// @route   PUT /api/users/:id/role
export const updateUserRole = async (req: any, res: any) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 🛡️ Safety Check: Prevent self-demotion
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot change your own admin status'
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User role updated to ${role}`,
            data: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Delete user (Admin Only)
// @route   DELETE /api/users/:id
export const deleteUser = async (req: any, res: any) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Prevent self-deletion
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
