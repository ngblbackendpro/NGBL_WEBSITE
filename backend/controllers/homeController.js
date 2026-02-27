const Home = require('../models/Home');

/* ======================================================
   Get Home Data
====================================================== */
exports.getHomeData = async (req, res) => {
    try {
        let home = await Home.findOne();
        if (!home) {
            home = await Home.create({});
        }
        res.json(home);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ======================================================
   Update Experience Years
====================================================== */
exports.updateExperience = async (req, res) => {
    try {
        const { expYears } = req.body;
        const home = await Home.findOneAndUpdate({}, { expYears }, { new: true, upsert: true });
        res.json(home);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ======================================================
   Update Total Projects
====================================================== */
exports.updateProjects = async (req, res) => {
    try {
        const { totalProjects } = req.body;
        const home = await Home.findOneAndUpdate({}, { totalProjects }, { new: true, upsert: true });
        res.json(home);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ======================================================
   Offices
====================================================== */
exports.addOffice = async (req, res) => {
    try {
        const { location, address, email, phone } = req.body;
        const home = await Home.findOne();
        home.offices.push({ location, address, email, phone });
        await home.save();
        res.json(home.offices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateOffice = async (req, res) => {
    try {
        const { id } = req.params;
        const { location, address, email, phone } = req.body;

        const home = await Home.findOne();
        if (!home) {
            return res.status(404).json({ message: "Home data not found" });
        }

        const office = home.offices.id(id);
        if (!office) {
            return res.status(404).json({ message: "Office not found" });
        }

        office.location = location || office.location;
        office.address = address || office.address;
        office.email = email || office.email;
        office.phone = phone || office.phone;

        await home.save();

        res.json(home.offices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.deleteOffice = async (req, res) => {
    try {
        const { id } = req.params;

        const home = await Home.findOne();
        if (!home) {
            return res.status(404).json({ message: "Home data not found" });
        }

        const office = home.offices.id(id);
        if (!office) {
            return res.status(404).json({ message: "Office not found" });
        }

        office.deleteOne();   // ✅ safer than remove()
        await home.save();

        res.json(home.offices);

    } catch (err) {
        console.error("Delete Office Error:", err);
        res.status(500).json({ message: err.message });
    }
};



exports.updateCompanyInfo = async (req, res) => {
    try {
        const { phone, email, address } = req.body;

        let home = await Home.findOne();

        // If no document exists, create one
        if (!home) {
            home = new Home({
                companyInfo: { phone, email, address }
            });
            await home.save();
        } else {
            home.companyInfo = { phone, email, address };
            await home.save();
        }

        res.status(200).json(home.companyInfo);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/* ======================================================
   Social Links
====================================================== */
exports.updateSocialLinks = async (req, res) => {
    try {
        const socialLinks = req.body; // { facebook, twitter, linkedin, instagram, youtube }
        const home = await Home.findOneAndUpdate(
            {},
            { socialLinks },
            { new: true, upsert: true }
        );
        res.json(home.socialLinks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
