const User = require('../models/user');

//register
module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

module.exports.register = async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        // req.login(registeredUser, err => {
        //     if (err) return next(err);
        //     req.flash('success', 'Welcome to Yelp Camp!')
        //     res.redirect('/campgrounds');
        // })
        req.flash('success', 'Successfully registered! Please login.');
        res.redirect('/login');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

//login
module.exports.loginForm = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', `Welcome back, ${req.body.username}!`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//logout
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Logout Successfully!')
    res.redirect('/campgrounds');
}