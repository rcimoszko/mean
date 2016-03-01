'use strict';

module.exports = {
    /*
    secure: {
        ssl: true,
        privateKey: './config/sslcerts/key.pem',
        certificate: './config/sslcerts/cert.pem'
    },

    port: process.env.PORT || 8443,
     */
    db: {
        uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/fu4-production',
        options: {
            user: '',
            pass: ''
        },
        // Enable mongoose debug mode
        debug: process.env.MONGODB_DEBUG || false
    },
    log: {
        // logging with Morgan - https://github.com/expressjs/morgan
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: process.env.LOG_FORMAT || 'combined',
        options: {
            // Stream defaults to process.stdout
            // Uncomment/comment to toggle the logging to a log on the file system
            stream: {
                directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
                fileName: process.env.LOG_FILE || 'access.log',
                rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
                    active: process.env.LOG_ROTATING_ACTIVE === 'true' ? true : false, // activate to use rotating logs
                    fileName: process.env.LOG_ROTATING_FILE || 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
                    frequency: process.env.LOG_ROTATING_FREQUENCY || 'daily',
                    verbose: process.env.LOG_ROTATING_VERBOSE === 'true' ? true : false
                }
            }
        }
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || '208601072671209',
        clientSecret: process.env.FACEBOOK_SECRET || '4bd32fdd07b1481066905d730d20d625',
        callbackURL: 'https://fansunite.com/api/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'AEcenyobBLBhPRhYCscaw',
        clientSecret: process.env.TWITTER_SECRET || 'mwiBG42jVbjxtaVx7MQBFsUXfA1RvJyzPfL2EJQpXQU',
        callbackURL: 'https://fansunite.com/api/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || '499181171419-q96qpde2lldurcm0th238tdlpefibiop.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_SECRET || 'xaQUkh_qnPKvW7OPCszj-Adf',
        callbackURL: 'https://fansunite.com/api/auth/google/callback'
    },
    mailer: {
        from: process.env.MAILER_FROM || 'FansUnite <info@fansunite.com>',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'info@fansunite.com',
                pass: process.env.MAILER_PASSWORD || 'Mokadoggie5'
            }
        }
    },
    maaxMarket:{
        mailer: {
            from: process.env.MAILER_FROM || 'FansUnite <info@fansunite.com>',
            options:{
                //auth: 'smtps://info%40fansunite.com:fansunite123$@smtp.sendgrid.net',
                host: 'smtp.sendgrid.net',
                secure: true,
                port: 587,
                auth: {
                    user: 'info@fansunite.com',
                    pass: 'fansunite123$'
                }
            }
        }
    },
    linkedin: {
        clientID: process.env.LINKEDIN_ID || 'APP_ID',
        clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/linkedin/callback'
    },
    github: {
        clientID: process.env.GITHUB_ID || 'APP_ID',
        clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
        callbackURL: '/api/auth/github/callback'
    },
    paypal: {
        clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
        clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
        callbackURL: '/api/auth/paypal/callback',
        sandbox: false
    },
    seedDB: {
        seed: process.env.MONGO_SEED === 'true' ? true : false,
        options: {
            logResults: process.env.MONGO_SEED_LOG_RESULTS === 'false' ? false : true,
            seedUser: {
                username: process.env.MONGO_SEED_USER_USERNAME || 'user',
                provider: 'local',
                email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
                firstName: 'User',
                lastName: 'Local',
                displayName: 'User Local',
                roles: ['user']
            },
            seedAdmin: {
                username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
                provider: 'local',
                email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
                firstName: 'Admin',
                lastName: 'Local',
                displayName: 'Admin Local',
                roles: ['user', 'admin']
            }
        }
    },
    cloudinary: {
        cloud_name: 'hsja3e1bm',
        api_key: '122295567144523',
        api_secret: 'eubpKedt6lqvurKT_lEPm5rS6Vc'
    },
    stripe: {
        secretKey: 'sk_live_6xoQCwdSlva2BrgEtipHBjvL'
    },
    mailchimp: {
        apiKey: '65e7a9d6f2340ff0a32b6108343bf392-us6',
        listName:  'FansUnite Users'
    }
};
