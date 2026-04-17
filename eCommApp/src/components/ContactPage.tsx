import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [issue, setIssue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setName('');
        setEmail('');
        setIssue('');
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <div className="contact-container">
                    <h2>Contact Us</h2>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <label htmlFor="contact-name">Name</label>
                        <input
                            id="contact-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <label htmlFor="contact-email">Email Address</label>
                        <input
                            id="contact-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label htmlFor="contact-issue">Issue</label>
                        <textarea
                            id="contact-issue"
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            required
                        />

                        <button type="submit">Submit</button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
