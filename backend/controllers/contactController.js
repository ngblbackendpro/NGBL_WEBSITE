const Contact = require("../models/Contact");

exports.createContact = async (req, res) => {
    try {
        const { name, email, subject, phone, service, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const contact = new Contact({
            name,
            email,
            subject,
            phone,
            service,
            message,
            isRead: false  
        });

        await contact.save();

        res.status(201).json({ message: "Message stored successfully" });

    } catch (error) {
        console.error("Contact Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/* ======================================================
   Get Unread Notifications
====================================================== */
exports.getUnreadNotifications = async (req, res) => {
    try {
        const unreadContacts = await Contact
            .find({ isRead: false })
            .sort({ createdAt: -1 });

        res.json(unreadContacts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


/* ======================================================
   Mark Notifications As Read
====================================================== */
exports.markNotificationsAsRead = async (req, res) => {
   try {
        await Contact.findByIdAndUpdate(req.params.id, {
            isRead: true
        });

        res.json({ message: "Marked as read" });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.downloadContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        let csv = "Name,Email,Phone,Service,Subject,Message,Date\n";

        contacts.forEach(contact => {
            csv += `"${contact.name}","${contact.email}","${contact.phone || ''}","${contact.service || ''}","${contact.subject || ''}","${contact.message}","${contact.createdAt}"\n`;
        });

        res.header("Content-Type", "text/csv");
        res.attachment("contacts.csv");
        return res.send(csv);

    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ message: "Server error" });
    }
};