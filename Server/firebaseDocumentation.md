+ USERS
	+ uid 1
		+ AREAS
			+ uid area 1
				+ Action
					+ Description (string)
					+ serviceName (string)
					+ subject (string)
					+ text (string)
					+ trigger (boolean)
				+ Reaction
					+  Description (string)
					+ serviceName (string)
					+ subject (string)
				+ id (string)
			+ uid area 2
			+ uid area n
		+ GoogleService
			+ clientId (string)
			+ clientSecret (string)
			+ recipient (string)
			+ refreshToken (string)
			+ refreshTokenCalendar (string)
			+ user (string)
		+ IssStation
			+ gap (int)
			+ latitude (float)
			+ longitude (float)
		+ OpenMeteoService
			+ latitude (float)
			+ longitude (float)
		+ StravaService
			+ access_token (string)
			+ athleteId (string)
		+ TwitterService
			+ userId (string)
			+ userName (string)
			+ userToken (string)
			+ userTokenSecret (string)
		+ TwitchService
			+ accessToken (string)
			+ authorization (string)
			+ refreshToken (string)
		+ email (string)
	+ uid 2
	+ uid n
+ SERVER
	+ Twitch
		+ clientId (string)
		+ clientSecret (string)
		+ redirect_url (string)
	+ Twitter
		+ appKey (string)
		+ appSecret (string)
		+ bearer (string)
		+ callbackurl (string)
	+ Strava
		+ client_id (string)
		+ client_secret (string)
	+ Spotify
		+ clientId (string)
		+ clientSecret (string)
	+ GoogleService
		+ clientId (string)
		+ clientSecret (string)
		+ refreshToken (string)
		+ refreshTokenCalendar (string)
		+ user (string)