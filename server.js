require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Resend } = require("resend");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/", async (req, res) => {
    res.json({ message: "LIDS API workinf perfect! 🚀" });
});

app.post("/send-email-for-leed", async (req, res) => {
    const { email, name, phone, company, message } = req.body;

    // Verifica que todos los campos requeridos estén presentes
    if (!email || !name || !phone || !company || !message) {
        return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    try {
        const { data, error } = await resend.emails.send({
            from: "Contacto Lids <contacto@lids.cl>",
            to: "fjvidelar@lids.cl",
            subject: `Contacto WEB de: ${name} - ${company}`,
            html: `
            <p>Hola equipo de LID Security,</p>
            <p>&nbsp;</p>
            <p>
                Has recibido un nuevo mensaje a trav&eacute;s del formulario de
                contacto web:
            </p>
            <p>&nbsp;</p>
            <p>
                Nombre:
                <span style="color: #3598db; font-size: 14pt">${name}</span>
            </p>
            <p>
                Correo electr&oacute;nico:
                <span style="color: #3598db; font-size: 14pt">${email}</span>
            </p>
            <p>
                Tel&eacute;fono:
                <span style="color: #3598db; font-size: 14pt">${phone}</span>
            </p>
            <p>
                Empresa:
                <span style="color: #3598db; font-size: 14pt"
                    >${company}</span
                >
            </p>
            <p>Mensaje:</p>
            <p>
                <span style="color: #3598db; font-size: 14pt"
                    >${message}&nbsp;</span
                >
            </p>
            <p>&nbsp;</p>
            <p>Formulario de contacto - LID Security</p>
            `,
        });

        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al enviar el correo" });
        }

        res.status(200).json({ message: "Correo enviado con éxito", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
