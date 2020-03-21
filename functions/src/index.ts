import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
// import { google } from 'googleapis';

// const {google} = require('googleapis');

// SENDING MAIL WITH GOOGLE
// const clientId = functions.config().gmail.clientid;
// const clientSecret = functions.config().gmail.secret;
// const gOAuth2Url = functions.config().gmail.url;
// const gEmail = functions.config().gmail.login;
// const refreshToken = functions.config().gmail.refreshtoken

// const oauth2Client = new google.auth.OAuth2(clientId,clientSecret,gOAuth2Url)
// oauth2Client.setCredentials({
// 	refresh_token: refreshToken
// });

// const accessToken = oauth2Client.getAccessToken()

//SENDING MAIL WITH SMTP2GO 
const smtp2goUsername = functions.config().smtp2go.username;
const smtp2goPass = functions.config().smtp2go.pass;

admin.initializeApp();

const goMail = (message: String) => {
	const transporter = nodemailer.createTransport({
		service: "mail.smtp2go.com",
		port: 2525, // 8025, 587 and 25 can also be used.
		auth: {
			user: smtp2goUsername,
			pass: smtp2goPass
		}
	});

	// const transporter = nodemailer.createTransport({
	// 	"host": "smtp.gmail.com",
	// 	"port": 465,
	// 	"secure": true,
	// 	"auth": {
	// 		type: 'OAuth2',
	// 		user: gEmail,
	// 		clientId: clientId,
	// 		clientSecret: clientSecret,
	// 		refreshToken: refreshToken,
	// 		accessToken: String(accessToken),
	// 		accessUrl: gOAuth2Url
			
	// 	},
	// 	"tls": {
	// 		rejectUnauthorized: false
	// 	}
	// })

	const mailOptions = {
		from: smtp2goUsername,
		to: smtp2goUsername,
		subject: 'New Client Message: BafisiPortfolio',
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

exports.onDataAdded = functions.database.ref('/portforlioEmails/{sessionId}').onCreate(
	(snap: functions.database.DataSnapshot, context: functions.EventContext) => {
		const createdData = snap.val();
		const text = createdData.mail;

		goMail(text)
	})


