import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import * as nodemailer from 'nodemailer'


const gEmail = functions.config().gmail.login;
const gPassword = functions.config().gmail.pass;

admin.initializeApp();

const goMail = (message: String) => {

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: gEmail,
			pass: gPassword
		}
	})

	const mailOptions = {
		from: gEmail,
		to: 'kc',
		subject: 'Hello',
		text: '!' + message,
		html: '!' + message
	}

	const getDeliveryStatus = (error: any, info: any) => {
		if (error) {
			console.log(error)
			return 
		}
		console.log(`Message sent: ${info.messageId}`)

	}

	transporter.sendMail(mailOptions, getDeliveryStatus)

}

exports.onDataAdded = functions.database.ref('/emails/{sessionId}').onCreate(
	(snap: functions.database.DataSnapshot, context: functions.EventContext) => {
		const createdData = snap.val();
		const text = createdData.mail;

		goMail(text)
	})


