'use strict';

angular.module('fu').factory('SportsbookService', ['$resource', '$sce', '$filter', 'Location',  function($resource, $sce, $filter, Location) {

    var defaultRank = [
        'Pinnacle', 'Bet365', '5Dimes', 'William Hill', 'Ladbrokes', 'BetCRIS', 'Sports Interaction', 'Bovada', 'Bookmaker','BetFair'
    ];

    var remainder = [
        'Bet365', 'William Hill', 'Ladbrokes', 'BetFair', 'Pinnacle'
    ];

    var countryRank = {
        'BR':['Ladbrokes', 'Bet365'], //Brazil
        //'AR':[], //Argentina
        //'MX':[], //Mexico
        'GB':['Bet365', 'Ladbrokes', 'William Hill'], //UK
        'AU':['Bet365'], //Australia
        'NZ':['Bet365'], //New Zealand
        'ES':['Bet365', 'William Hill', 'BetFair'], //Spain
        'SE':['Bet365'] //Sweden
    };

    var sportsbooks = [
        {
            name: '5Dimes',
            affiliateUrl: 'http://affiliates.5dimes.com/tracking/Affiliate.asp?AffID=AF0005190&mediaTypeID=322&Image=/tracking/banner/728x90/5D728x90_01_14_10.gif&AffUrlID=6000',
            depositMethods:[
                ['Credit Card', 'Neteller', 'Skrill'],
                ['Click2Pay', 'Money Order', 'Cheque']
            ],
            withdrawalMethods:[
                ['Bank Transfer', 'Cheque', 'Click2Pay', 'Skrill'],
                ['Money Order', 'Neteller', 'Visa']
            ],
            bonus: true,
            newAccountBonus: '50% Match Bonus up to $200',
            bonuses: [
                {type:'New Account', bonus:'50% Match Bonus up to $200'}
            ],
            restricted: ['France'],
            grade: 'B+',
            banner: $sce.trustAsHtml('<a href="http://affiliates.5dimes.com/tracking/Affiliate.asp?AffID=AF0005190&mediaTypeID=322&Image=/tracking/banner/728x90/5D728x90_01_14_10.gif&AffUrlID=6000" target="_top">'+
                '<img src="http://affiliates.5dimes.com/tracking/banner.asp?AffID=AF0005190&mediaTypeID=322&Image=/tracking/banner/728x90/5D728x90_01_14_10.gif&AffUrlID=6000" hspace="0" vspace="0" border="0" alt="Bet at 5Dimes"></a>'),
            overview: '5 Dimes is another book that is amongst the best and is on the same level as Pinnacle Sports and Bet 365. 5 Dimes’ specialty and reputation lies in the extensive selections and alternate lines that it offers. 5 Dimes offers many options for many sporting events. They are a little light in their soccer offerings, but other than that it is absolutely first class. For our American friends, this is the top sports book that allows American users. It is an extremely reliable book that has been in business since 1999. They are financially stable, offering a huge selection of wagering options, and are reliable in their deposits and payouts. For the experienced and professional bettor, 5 Dimes is a wonderful option due to the sheer variety of betting options they have. Simply, they are one of the best in the industry and a great choice for all. The reason why we rate 5 Dimes a grade below the elite books is that their live betting options are quite substandard. Very few events allow for live betting on 5 Dimes, and often, live betting is only available during game breaks. ',
            interface: ' 5 Dimes philosophy for their interface is to keep it simple. There is a massive array of betting options, but they keep everything clean and straightforward. The site is well organized and easy to navigate. Further, there are drop down boxes to allow a user to buy points to have even more alternate lines. While their website interface is appealing for its simplicity, the mobile version is actually quite cumbersome to use. It is not very user friendly and requires a lot of zooming in and out in order to navigate to the wager selection that is desired. ',
            offerings: 'As stated previously, 5 dimes has the most variations in selections for a given event. Their alternate line options are superb, and they reduced juice on virtually all events. Obviously, this is extremely important for any serious bettor as the differences in price will accumulate quickly. 5 Dimes covers many events but is a little short in their soccer offerings. Additionally, their live betting offerings are quite poor. Anyone whose focus is on live betting should use 5 Dimes as one of their sports books as opposed to being their primary book. ',
            cashReview: 'Excellent. Importantly, 5 Dimes is one of the most financially stable sports books. This is important as it helps ensure that they will payout. 5 Dimes has many deposit and withdrawal methods that occur without issue. For American users, we have found that withdrawal by Cheque is the best method. There is a $40-$50 fee to get a cheque via courier, but the money will be received in about 3 business days. The cheque will be written by a payment company so your bank will have no idea that the cheque is from a sports book. ',
            customerService: 'Our only complaint with the customer service of 5 Dimes is that they do not have an online chat system in place. For quick questions, this would be much easier for the user. 5 Dime allows customer service inquiries via email, fax, and phone. When required, the user needs to visit the customer service page, which lists contact phone numbers for questions in different inquiry areas. ',
            depositReview: 'All deposit methods are effective and will enable access to your funds in a timely manner. There are no charges for deposits, but the minimum deposit amounts are either $50 or $100, dependent on the deposit method. ',
            withdrawalReview: 'This may be regionally dependent, but from what we find, all withdrawals are free.',
            languages: [['English', 'Spanish']],
            screenshot: false
        },
        {
            name: 'Bet365',
            affiliateUrl: 'http://imstore.bet365affiliates.com/Tracker.aspx?AffiliateId=73547&AffiliateCode=365_317245&CID=194&DID=211&TID=2&PID=149&LNG=1',
            depositMethods:[
                ['Bank Transfer', 'Bank Wire', 'Cheque', 'Click2Pay', 'EntroPay', 'Instadebit', 'Maestrocard'],
                ['Master Card', 'Money Bookers', 'Neteller', 'Paypal', 'Paysafe', 'U-kash', 'Visa']
            ],
            withdrawalMethods:[
                ['Bank Transfer', 'Bank Wire', 'Cheque', 'Click2Pay', 'Instadebit', 'Maestro'],
                ['Mastercard', 'Moneybookers', 'Neteller', 'Paypal', 'Visa']

            ],
            bonus: true,
            newAccountBonus: '100% Initial Deposit Bonus (up to $200)',
            bonuses: [
                {type:'Reload', bonus:'None'},
                {type:'Loyalty', bonus:'Yes. Accounts are reviewed weekly. Most frequent is a $20 Loyalty Bonus every few weeks.'},
                {type:'New Account', bonus:'100% Initial Deposit Bonus (up to $200)'}],

            restricted: ['Belgium', 'France', 'USA'],
            grade: 'A',
            banner:  $sce.trustAsHtml(' <object type="application/x-shockwave-flash"'+
                'id="a136a6f7c68ab4a6dac1a77366a2374ae"'+
                'data="http://imstore.bet365affiliates.com/?AffiliateCode=365_317245&amp;CID=194&amp;DID=211&amp;TID=2&amp;PID=149&amp;LNG=1&amp;ClickTag=http%3a%2f%2fimstore.bet365affiliates.com%2fTracker.aspx%3fAffiliateId%3d73547%26AffiliateCode%3d365_317245%26CID%3d194%26DID%3d211%26TID%3d2%26PID%3d149%26LNG%3d1&amp;Popup=true"'+
                'width="765"'+
                'height="90">'+
                '<param name="movie" value="http://imstore.bet365affiliates.com/?AffiliateCode=365_317245&amp;CID=194&amp;DID=211&amp;TID=2&amp;PID=149&amp;LNG=1&amp;ClickTag=http%3a%2f%2fimstore.bet365affiliates.com%2fTracker.aspx%3fAffiliateId%3d73547%26AffiliateCode%3d365_317245%26CID%3d194%26DID%3d211%26TID%3d2%26PID%3d149%26LNG%3d1&amp;Popup=true" />'+
                '<param name="quality" value="high" />'+
                '<param name="wmode" value="transparent" />'+
                '<param name="allowScriptAccess" value="always" />'+
                '<param name="allowNetworking" value="external" />'+
                '<a href="http://imstore.bet365affiliates.com/Tracker.aspx?AffiliateId=73547&amp;AffiliateCode=365_317245&amp;CID=194&amp;DID=211&amp;TID=1&amp;PID=149&amp;LNG=1" target="_blank">'+
                '<img src="http://imstore.bet365affiliates.com/?AffiliateCode=365_317245&amp;CID=194&amp;DID=211&amp;TID=1&amp;PID=149&amp;LNG=1" style="border:0;" alt="bet365"></img></a>'+
                '</object>'),
            overview: 'Bet365 has quickly become an extremely popular sports book due to their sterling reputation regarding their service, support, and payout system. Bet365 offer more than just sports betting as well, with platforms existing for Bingo, Lottery, Poker, and Casino Games. As a result, their gaming platform can satisfy both recreational and serious players. Bet 365’s standout feature is their live (in-play) betting platform. They offer live betting on many matches across a variety of sports and leagues. Impressively, they also feature live streams of the matches where available. If there is not a live stream for the match, they have a fluid game center that allows bettors to follow the action. Their gaming operations are licensed and regulated by the government of Gibraltar.  For anyone considering live (in-play) betting, Bet 365 is the premier sports book.',
            interface: 'Bet 365 offers the most impressive interface in the sports betting world. The interface is extremely easy to use, with a constant betting menu along the left side and a betting slip along the right. The center of the screen is where players can select their wagers. The color scheme is aesthetically appealing, whilst remaining subdued enough that a user can spend hours on the site. The only drawback with Bet 365’s interface is that it is flash based. What this means is that users cannot complete a search on a page to find the match they are looking for. This can be an issue when browsing Europa League Qualifiers, wherein there can be 30 matches, and attempting to find the team you would like to back! Bet 365’s mobile experience is top notch. It is easy to navigate the various betting menu’s, as well as to make any wagers. Really, their mobile interface is almost as good as their full website experience.',
            offerings: 'Bet 365 does a great job of offering all the major sports and leagues. While they may not have every soccer league, they do have the great majority, along with all of the major sports and leagues that are wagered on the world over. Bet 365 has one of the more comprehensive sport offerings that we have seen. As stated above, platforms exist for Bingo, Lottery, Poker, and Casino Games as well. Again, Bet 365 have the premier live (in-play) betting platform amongst sports books. Their live high-definition stream of a variety of matches is a massive asset for players.',
            cashReview: 'Excellent. Quick withdrawals, without issue, and easy deposits allows Bet 365 an Excellent Cashier rating. Bet 365 has one of the most solid financial backgrounds in the sports betting industry, so players do not have to worry about payouts. Bet 365 are subject to arbitration through the IBAS (Independent Betting Adjudication Service), who settle disputes between gaming companies.',
            customerService: 'Bet 365 offers customer support 24 hours a day, 7 days a week. Their customer support is reachable in a variety of ways. Bet 365 offers customer support via live chat, email, call back service, fax, and phone. In our experience, their agents reply quickly and efficiently, and address any concerns adequately. Bet 365 has an excellent customer service rating in our books.',
            depositReview: 'There are many deposit methods, some which are regionally dependent. All deposit methods are effective and will enable access to your funds in a timely manner. There are no charges for deposits, save for Bank Transfers, which are only free if you deposit a minimum amount.',
            withdrawalReview: 'Again, this may be regionally dependent, but from what we find, all withdrawals are free. Bank Wire and Bank Transfers only allow one free withdrawal every 28 days.',
            languages: [
                ['Bulgarian','Chinese','Czech','Danish','English','German', 'Greek','Hungarian'],
                ['Italian', 'Norwegian','Polish','Portuguese','Romanian','Slovakian','Spanish','Swedish']
            ],
            screenshot: true
        },
        {
            name: 'BetCRIS',
            affiliateUrl: '',
            depositMethods:[
                ['Bank Draft', 'Bank Wire', 'Credit Card', 'Click2Pay'],
                ['Entropay', 'Neteller', 'P2P', 'Skrill']
            ],
            withdrawalMethods:[
                ['Bank Draft – Minimum $100 withdrawal; max $2,500 per transaction', 'Bank Wire', 'Click2Pay'],
                ['Skrill – Minimum $25 withdrawal; Max $10,000 per transaction; up to $50,000 weekly']
            ],
            bonus: true,
            newAccountBonus: '15% Welcome Bonus(up to $500)',
            bonuses: [
                {type:'Reload', bonus:'10% reload bonus up to $500'},
                {type:'New Account', bonus:'15% Welcome Bonus(up to $500)'}
            ],
            restricted: ['USA'],
            grade: 'B+',
            banner: '',
            overview: 'BetCRIS stands for Bet Costa Rica International Sports and have been in business since 1985, when they were established as the first offshore sports book. BetCRIS were either the first, or one of the first to be a part of the online sports book industry. As expected, since they have been around for so long, BetCRIS have optimized their product and are now amongst the best online sportsbooks available. Their betting market coverage is exceptional, and their customer service is top notch. BetCRIS have an extremely stable financial situation and have a part in a number of land based gaming business around the world, including in Dominican Republic, Ecuador, Peru, Honduras, Guatemala, Venezuela, and Mexico. Other companies under the BetCRIS umbrella are Bookmaker and Diamond Sportsbook. Some sports books will limit payouts to smaller sums, but BetCRIS offers a $50,000 weekly maximum payout upon signup. If you are looking for a dependable and easy to use sportsbook, then BetCRIS may be your best bet.',
            interface: 'BetCRIS employs an extremely intuitive and professional layout style for their interface. There is the constant betting menu on the left as well as the featured matches in the middle. The menus are laid out exactly as you would expect, and even has some of the same layout choices as industry leader Bet 365. It is a simple and effective platform and one that we can gladly recommend. We aren’t giant fans that BetCRIS requires the use of a drop down menu to access their live betting options, but that is a relatively minor issue. Importantly, their page is completely searchable in order to quickly find the exact event you are looking for. BetCRIS does not use many scripts, just static HTML, so their interface is quite responsive. ',
            offerings: 'BetCRIS does a great job of offering all the major sports and leagues. While they may not have every soccer league, they do have the great majority, along with all of the major sports and leagues that are wagered on the world over. Bet CRIS has one of the more comprehensive sport offerings that we have seen. Additionally, BetCRIS have a massive range of prop bets available for the major North American sports. If there is an event you want to wager on that is not available on BetCRIS, you can email them and they will consider releasing odds for you. Their live betting offerings are quite poor, however, and that is one reason we don’t rank them amongst the elite. ',
            cashReview: 'Excellent. BetCRIS have a terrific payout record and we have absolutely zero qualms about recommending them. Users have constantly provided positive feedback in regards to how easy it is to withdraw large sums from BetCRIS. As stated previously, all new players are automatically eligible to withdraw up to $50,000 a week. ',
            customerService: 'BetCRIS has a big bilingual staff and are known for their quick and clear service. They offer customer service through three methods – email support, toll-free phone support, and live chat. BetCRIS prides themselves on their great customer service. Most email inquiries will be addressed within 15 minutes. Moreover, hold time on phone inquiries are usually quite low. ',
            depositReview: 'There are many deposit methods, some which are regionally dependent. All deposit methods are effective and will enable access to your funds in a timely manner. There are no charges for deposits, but most require a minimum deposit amount.',
            withdrawalReview: '',
            languages: [['English', 'French', 'Chinese', 'Portuguese', 'Spanish']],
            screenshot: true
        },
        {
            name: 'Bovada',
            affiliateUrl: 'http://record.bettingpartners.com/_G1jpQTLp4eIUbyPgnoR23mNd7ZgqdRLk/1/',
            depositMethods:[
                ['Bank Wire', 'Credit Cards', 'Moneygram', 'Western Union']
            ],
            withdrawalMethods:[
                ['Bank Wire', 'Courier Cheque', 'Moneygram', 'Western Union']
            ],
            bonus: true,
            newAccountBonus: '50% Welcome Bonus (up to $250)',
            bonuses: [
                {type:'New Account', bonus:'50% Free play (up to $250)'}
            ],
            restricted: ['Canada', 'UK'],
            grade: 'B',
            banner: $sce.trustAsHtml('<script type="text/javascript" src="http://js.bettingpartners.com/javascript.php?prefix=G1jpQTLp4eKYLQPVBzQgNGNd7ZgqdRLk&amp;media=6378&amp;campaign=1"></script> <iframe allowtransparency="true" src="http://ff.connextra.com/BODOG/selector/client?client=BODOG&placement=Bodog_Sports_BetonSports_728x90&cxt_aff_id=G1jpQTLp4eJI6ooFPD8EIe51t5g1cLjN" width="728" height="90" scrolling="no" frameborder="0" style="border-width:0"></iframe>'),
            overview: 'On December 14th, 2011, Bodog changed their domain name for U.S. players to Bovada. Bovada features the same platform, customer service, and betting options that existing Bodog customers are accustomed to. The Bovada brand is exclusively for use by U.S. customers. From here on out, we are going to refer to Bovada/Bodog as Bovada, since they are the same thing. Bovada is a respectable company that is quick to realize their shortcomings. They always payout, but we really appreciate that they will be the first to admit if processing times in the U.S. are going to take longer, for whatever reason. They are reliable, and their transition from Bodog to Bovada was seamless. Bovada are quickly becoming a popular online sports book. Due to their issues in 2011, we can’t rank them as highly as others. That being said, they are a professional and appealing book. They cater more to recreational bettors and we would not recommend it as a staple book for more serious bettors. ',
            interface: 'Bovada have a simple stylistic approach, which allows new users to jump right in to the action. Anyone who has visited a betting site previously should be comfortable with Bovada’s layout. Bovada’s software was updated in 2011. Since the upgrade, everything works smoothly, functions well, and looks good on all platforms, including their mobile version. ',
            offerings: 'Bovada are a North American book that is, consequently, geared primarily towards North American sports. While they do cover many global sports, generally the leagues covered will only be the major ones. If you are only concerned with wagering on the top soccer leagues and major sporting events, then Bovada will work for you just fine. If you are looking for value in some more obscure regions, then Bovada will not be a fit. One of our major issues with Bovada is that they typically offer poor odds for favorites. Again, this is because they are geared mostly towards recreational bettors. ',
            cashReview: 'Excellent. Bovada are a financially stable book that has always paid out. Users should have little to no fear that Bovada will fail to pay out. They have consistently paid players in a timely manner and seem to genuinely resolve any potential issues. ',
            customerService: 'Bovada’s Customer Service platform is amongst the best in the industry. As stated previously, Bovada’s agents seem to genuinely care about the players issue and will fix the problem. Bovada’s Customer Service department is reachable by phone or email 24/7. ',
            depositReview: 'Bovada will only cover Western Union and MoneyGram fees for deposits of $300 or more. ',
            withdrawalReview: 'Withdrawal by MoneyGram or Western Union is only available if the user deposited through the same method. Bovada offers U.S. players one free check withdrawal per month. Checks generally take about one week to be received. ',
            languages: [['English']],
            screenshot: true
        },
        {
            name: 'BetFair',
            affiliateUrl: 'http://ads.betfair.com/redirect.aspx?pid=1260644&bid=8663',
            depositMethods:[
                ['Bank Wire', 'Cheques', 'Credit Card', 'Entropay'],
                ['E-Wallet', 'Moneybookers', 'Neteller']
            ],
            withdrawalMethods:[
                ['Bank Wire', 'Cheques', 'Credit Card', 'Entropay'],
                ['E-Wallet', 'Moneybookers', 'Neteller']
            ],
            bonus: true,
            newAccountBonus: '$50 Free Bet',
            bonuses: [
                {type:'New Account', bonus:'$50 Free Bet'}
            ],
            restricted: ['USA','France', 'Germany', 'Greece', 'China', 'Japan', 'Turkey'],
            grade: 'B',
            banner: $sce.trustAsHtml('<iframe allowtransparency="true" src="http://ads.betfair.com/ad.aspx?bid=9295&pid=1260644" width="728" height="90" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="no"></iframe>'),
            overview: 'In 2011, BetFair decided to become a bookmaker. Prior to 2011, BetFair was a betting exchange, which linked players wanting to make a corresponding wager. It was a revolutionary idea that opened up a new market, but BetFair decided to take part in the fixed odds market. They still offer the betting exchange market, but their standard fixed odds platform is quite good. The BetFair Sports Book was launched in 2012 as a highly respected betting exchange. Their range of betting markets exceeds that of any other sports book in the industry and the ability to wager in a sports book or against other community members is an exciting option. Players have the ability to negotiate prices on bets when dealing with community members. ',
            interface: 'BetFair have a pretty simple interface that is responsive and stable. The menu bar at the top will be used for most navigation, whilst the center of the screen is taken up by most of the betting overview screens. The color scheme is aesthetically appealing, whilst remaining subdued enough that a user can spend hours on the site. The main way to find lines is to visit the game centers for the market you are looking for. It can be a bit cumbersome, but everything you need is available quickly. ',
            offerings: 'BetFair does a great job of offering all the major sports and leagues. While they may not have every soccer league, they do have the great majority, along with all of the major sports and leagues that are wagered on the world over. BetFair has one of the more comprehensive sport offerings that we have seen, perhaps due to their exchange market encouraging the creation of ‘new’ markets. Their live betting platform has a lot of markets available for selection. They also offer BetFair TV, which allows for live streaming of select events. ',
            cashReview: 'Excellent. Quick withdrawals, without issue, and easy deposits allows BetFair an Excellent Cashier rating. BetFair has one of the most solid financial backgrounds in the sports betting industry, so players do not have to worry about payouts. BetFair’s security system is accredited with ISO 27001 Certification.',
            customerService: 'BetFair’s sports book is a little different than most, so they offer an extremely helpful help center, which has a repository of questions related to maximizing your BetFair experience. Their Customer Service department can be reached through email, telephone, or mail. ',
            depositReview: '',
            withdrawalReview: 'Withdrawals are performed through the same channel as the deposit was made. ',
            languages: [['English', 'Chinese', 'German', 'Italian', 'Finnish', 'Russian', 'Spanish']],
            screenshot: true
        },
        {
            name: 'Bookmaker',
            affiliateUrl: '',
            depositMethods:[
                ['Credit Card', 'Bank Wire', 'Bank Draft', 'Click2Pay', 'Neteller'],
                ['ECO', 'Moneygram', 'Paysafecard', 'JCB', 'MoneyBookers']
            ],
            withdrawalMethods:[
                ['Bank Draft', 'Bank Wire', 'Click2Pay', 'Eco', 'Neteller', 'MoneyBookers']

            ],
            bonus: true,
            newAccountBonus: '15% Free Play',
            bonuses: [
                {type:'New Account', bonus:'15% Free Play'},
                {type:'Reload', bonus:'Yes, 10% Free Play'},
                {type:'Loyalty', bonus:'Yes, Bet point loyalty program which can be exchanged for free bets'},
            ],
            restricted: ['France'],
            grade: 'B',
            banner: '',
            overview: 'BookMaker could just as easily be ranked as the top sports book out there as it could be in ninth in our rankings. It really is up to personal preference and we understand why many have BookMaker amongst the top. BookMaker is regarded so highly by other sports books, that most books will not even release their lines unless they have checked to see that BookMaker have established their numbers. To that end, BookMaker is the first place that you will see lines posted each night. BookMaker also do not limit winnings. Many players have complained about sports books limiting their wagers if they are doing well. That will not happen at BookMaker, where they will payout $100 just as happily as $100,000. This is a very large and established operation that is geared towards a sophisticated player. We would not recommend this book for beginners. BookMaker are operated by the same management as BetCRIS, making them one of the more stable sports book groups. BookMaker has over 25 years of experience, a flawless payout history, and a respected reputation amongst players and fellow sports books. ',
            interface: 'Well, as we stated, BookMaker are geared to more sophisticated users and that sentiment rings through with their interface. With arguably the most rudimentary bare bones interface offering out there, BookMaker promotes a no frills look. That being said, BookMaker has absolutely everything you could possibly need present, it’s just a very simplistic design. There is not necessarily anything wrong with that, it is completely up to personal preference. As with many books, the sports navigation menu is a constant on the left hand side. ',
            offerings: 'BookMaker does a great job of offering all the major sports and leagues. While they may not have every soccer league, they do have the great majority, along with all of the major sports and leagues that are wagered on the world over. BookMaker has one of the more comprehensive sport offerings that we have seen. They offer a great amount of prop bets, as well, if that’s your thing. BookMaker’s Live Betting offerings are amongst the best in the industry. Despite offering the standard updating lines for main plays, BookMaker also offers play-by-play betting lines on prop bets, such as Next Player to Score, Yards Gained, and many more! Their live-betting lines extend to the majority of televised sporting events, which is quite comprehensive. ',
            cashReview: ': Excellent. Quick withdrawals, without issue, and easy deposits allows BookMaker an Excellent Cashier rating. BookMaker has one of the most solid financial backgrounds in the sports betting industry, so players do not have to worry about payouts. They have a flawless payout history, extending well over 25 years. Players should have zero hesitation in depositing with BookMaker.',
            customerService: 'BookMaker has an outstanding Customer Service department. Our only issue is that Customer Service is only available in English, Spanish, and Chinese. Communicating through email can lead to reply times of up to two days, but their phone service and live chat are excellent. Don’t bother emailing BookMaker’s customer service department. Use the Live Chat or call them!',
            depositReview: 'There are many deposit methods, some which are regionally dependent. All deposit methods are effective and will enable access to your funds in a timely manner.',
            withdrawalReview: 'Again, this may be regionally dependent, but from what we find, most withdrawal methods have corresponding fees. ',
            languages: [['English', 'Chinese', 'Spanish']],
            screenshot: true
        },
        {
            name: 'Ladbrokes',
            affiliateUrl: 'http://online.ladbrokes.com/promoRedirect?key=ej0xMzkzNDkxMyZsPTEzOTMzODYzJnA9NjU1OTM4',
            depositMethods:[
                ['Credit Card', 'Bank Transfer', 'PayPal',  'ClickandBuy'],
                ['Neteller', 'Western Union', 'UKash', 'Moneybookers']
            ],
            withdrawalMethods:[
                ['Bank Transfer', 'ClickandBuy', 'Moneybookers'],
                ['Neteller', 'Paypal', 'UKash']
            ],
            bonus: true,
            newAccountBonus: '100% Match Bonus up to $100',
            bonuses: [
                {type:'New Account', bonus:'100% Match Bonus up to $100'}
            ],
            restricted: ['France', 'Turkey', 'USA'],
            grade: 'B+',
            banner: $sce.trustAsHtml(' <a href="http://online.ladbrokes.com/promoRedirect?key=ej0xMzkzNDkxMyZsPTEzOTMzODYzJnA9NjU1OTM4"><img src="http://online.ladbrokes.com/promoLoadDisplay?key=ej0xMzkzNDkxMyZsPTEzOTMzODYzJnA9NjU1OTM4" width="728" height="90"/></a>'),
            overview: 'Arguably, Ladbrokes is the biggest name in betting. Ladbrokes is listed on the London Stock Exchange, so a user can have confidence that the company is transparent and financially stable. In addition to their online services, Ladbrokes has over 2,400 betting shops in the United Kingdom and Ireland. Ladbrokes is an excellent choice for recreational and serious bettors. Thanks to their use of the Orbis Technology software, their platform runs flawlessly. Their mobile site is also very good. Ladbrokes offers a massive range of sports and events, as well as a comprehensive live betting suite. In our opinion, Ladbrokes is perfect for the recreational bettor. We would not recommend it for an experienced or professional bettor as we aren’t thrilled with many of the margins. Moreover, they just don’t have some of the added perks, like comprehensive live streaming, which we really appreciate in other books. That being said, they are a no nonsense company which covers all the events you could ask for. They are a mainstay in the betting company and will play a major role in the industry for years to come.',
            interface: 'Ladbrokes employs an extremely intuitive and professional layout style for their interface. There is the constant betting menu on the left as well as the featured matches in the middle. One issue we have with Ladbrokes is that there is almost too much presented at once and that amount of visual real estate is daunting. The menus are laid out exactly as you would expect, and even has some of the same layout choices as industry leader Bet 365. It is a simple and effective platform and one that we can gladly recommend.',
            offerings: 'We aren’t thrilled with the margins that Ladbrokes employs, and that leads us to recommend the company for a recreational bettor, more so than a professional. As any experienced bettor knows, the little margins can make a big difference in the long run. They do cover many leagues, but nothing that is extraordinary. Additionally, they only offer live streams for racing events. Their live betting coverage is very good.',
            cashReview: 'Excellent. Quick withdrawals, without issue, and easy deposits allows Ladbrokes an Excellent Cashier rating. Ladbrokes has one of the most solid financial backgrounds in the sports betting industry, so players do not have to worry about payouts. Ladbrokes are subject to arbitration through the IBAS (Independent Betting Adjudication Service), who settle disputes between gaming companies.',
            customerService: ':  Ladbrokes have extremely impressive customer service. Their agents are known for being able to support in multiple languages. Ladbrokes offers 24/7 customer service via live chat, email, or phone. They usually respond to emails within one or two hours. Impressively, they recently added the live chat option and support in several languages (English, Spanish, Italian, German, Swedish, Norwegian, Finnish, Danish, Turkish, Greek, Portuguese, Thai, Bulgarian, Croatian, Romanian, Russian, Slovenian, Slovak, Czech, and Russian).',
            depositReview: 'There are many deposit methods, some which are regionally dependent. All deposit methods are effective and will enable access to your funds in a timely manner. There are no charges for deposits.',
            withdrawalReview: 'Again, this may be regionally dependent, but from what we find, all withdrawals are free.',
            languages: [['English', 'Spanish', 'Italian', 'German', 'Swedish', 'Norwegian', 'Finnish', 'Danish', 'Turkish']],
            screenshot: true
        },
        {
            name: 'Pinnacle',
            affiliateUrl: 'http://affiliates.pinnaclesports.com/processing/clickthrgh.asp?btag=a_11567b_6346&aid=',
            depositMethods:[
                ['Bank Transfer', 'Click & Buy', 'Entropay',  'Idebit'],
                ['Instadebit', 'MasterCard', 'Visa', 'Ukash']
            ],
            withdrawalMethods:[
                ['Bank Transfer', 'Click & Buy', 'Entropay',  'E-cheque', 'Idebit'],
                ['Instadebit', 'MasterCard', 'Visa', 'Ukash']
            ],
            bonus: false,
            bonuses: [
                {type:'Reload', bonus:'None'},
                {type:'Loyalty', bonus:'None'},
                {type:'New Account', bonus:'None'}
            ],
            restricted: ['France', 'Netherlands', 'Turkey', 'USA'],
            grade: 'A',
            banner: $sce.trustAsHtml('<a onclick="window.open(this.href,"_blank");return false;" href="http://affiliates.pinnaclesports.com/processing/clickthrgh.asp?btag=a_11567b_1129&aid=" ><img src="http://affiliates.pinnaclesports.com/processing/impressions.asp?btag=a_11567b_1129&aid=" style="border:none;width:728px;height:90px;" border=""></a>'),
            overview: 'Pinnacle Sports was founded in 1998 and is headquartered in Curacao. Pinnacle has become one of the largest and most trusted sports books in the gaming industry. Despite voluntarily exiling themselves from the US market in 2007, Pinnacle Sports has had sustained positive growth. Pinnacle Sports are a sportsbook that every serious bettor should utilize. They offer the smallest margins in the industry, which often results in the best prices for bettors. Their interface is simple and professional, if not aesthetically appealing. We highly recommend Pinnacle Sports as the dependable and trustworthy industry standard. Due to their low juice lines, any serious bettor should have Pinnacle Sports as a part of their betting arsenal.',
            interface: 'Perhaps the only disappointing element of Pinnacle Sports is the betting interface. However, this critique is on an aesthetic level and is very much up to personal preference. Generally, the interface seems a little outdated and can be cumbersome to navigate. The sports navigation area consists of a two-column page with drop down menus to select sports and their corresponding sub-categories (leagues). Sports that have lines that are eligible to be played are given an orange triangle identifier for ease of navigation. The odds display is unspectacular but functional. The line overview for a given league takes up the width of the display and functions as a giant input form. This is contrasted with many other sports books that will allow the user to click on a bet which is then added to their betting slip. The maximum accepted wager amounts are displayed when you hover your mouse over a wager input form. The mobile experience is not much better, which makes it difficult to quickly find the game or games you are interested in playing.',
            offerings: 'Pinnacle does a great job of offering all the major sports and leagues. While they may not have every soccer league, they do have the great majority, along with all of the major sports and leagues that are wagered on the world over. Pinnacle also offers a wide variety of niche markets such as entertainment props, politics, e-sports, and poker. Our major complaint with Pinnacle’s offerings is their lack of a robust live betting offering. Pinnacle only has live betting for selected leagues. Additionally, Pinnacle does not continuously update their odds as the games are in play. For example, live betting baseball selections are suspended during the inning and are only available for betting at the half inning. We have seen recent improvements in their live betting offerings and are hopeful that they will continue to improve.',
            cashReview: 'Excellent. Quick withdrawals, without issue, and easy deposits allows Pinnacle Sports an Excellent Cashier rating.',
            customerService: 'Pinnacle offers customer support 24 hours a day, seven days a week, 365 days a year. However, there is no live chat option or even a phone number to contact support. Instead, all inquiries and follow-up questions that could be handled in minutes via a live chat platform may take multiple email exchanges with Pinnacle. While they are generally good at answering questions comprehensively, it is still an annoyance having to wait for an email exchange. That being said, once contacted, customer service is excellent and the service department works diligently to make sure all of your needs are met. It is important to remember that customer service is done primarily through email in order to keep costs low. Pinnacle Sports is so efficient and well run that there rarely are customer service issues that need to be addressed.',
            depositReview: 'While deposit methods are not as numerous as with other sports books, all the options are effective and will enable access to your funds in a timely manner. There are no charges for deposits.',
            withdrawalReview: 'For each of the deposit methods there is a corresponding withdrawal method on the same platform. Additionally, players may request an E-cheque as a withdrawal option. The first withdrawal each month is free, with subsequent withdrawals incurring a fee dependent on withdrawal method.',
            languages: [
                ['Chinese','English','Finnish','French','German', 'Hebrew','Italian', 'Japanese'],
                ['Norwegian','Polish','Portuguese','Russian','Spanish','Swedish', 'Thai']
            ],
            screenshot: true
        },
        {
            name: 'Sports Interaction',
            affiliateUrl: 'http://affiliate.sportsinteraction.com/processing/clickthrgh.asp?btag=a_7891b_334',
            depositMethods:[
                ['Credit Card', 'Instadebit', 'Instant Banking',  'Speedcard', 'MoneyBookers', 'Neteller', 'Ecocard'],
                ['Ukash', 'Swiff', 'UseMyFunds', 'Money Order', 'Certified Check', 'Cashier\'s Check']
            ],
            withdrawalMethods:[

            ],
            bonus: true,
            newAccountBonus: '100% Match Bonus up to $125',
            bonuses: [
                {type:'New Account', bonus:'100% Match Bonus up to $125'}
            ],
            restricted: ['Australia', 'France', 'USA'],
            grade: 'B',
            banner: $sce.trustAsHtml('<a href="http://affiliate.sportsinteraction.com/processing/clickthrgh.asp?btag=a_7891b_334"  ><img src="http://affiliate.sportsinteraction.com/processing/impressions.asp?btag=a_7891b_334" alt=“Sports Interaction”  style="border:none; width:728px;  height:90px; "/></a>'),
            overview: 'Sports Interaction is based out of Quebec, Canada and has been online since 1997. The first thing you will notice when you visit Sports Interaction is the professional and enticing platform that greets you. Sports Interaction is an online sports book that offers a clean and no frills platform for all your betting needs. It is commonly referred to as SIA and has an experienced team behind it. Although their live betting platform can be a little lacking at times, as well as odds that aren’t the most consumer friendly, Sports Interaction is a great starter book and one that you can grow with in the future. ',
            interface: 'Sports Interaction has one of our favorite betting interfaces in the market. They really utilize graphics well to add even more excitement for a user. While it may not be appealing for a professional, the entertainment factor is a plus in our books. Additionally, the bright blue color scheme, when contrasted with the orange text is quite aesthetically pleasing. The menus are laid out exactly as you would expect, and even has some of the same layout choices as industry leader Bet 365. One massive advantage they have over Bet 365 is that Sports Interaction’s pages are searchable and you can find the match you want quite quickly. The colors utilized allow the user to spend a long time on the platform without getting sick of the site. In regards to the interface, we would rank Sports Interaction as one of the best in the business. Sports Interaction has managed to cater to experienced bettors by supplying current news and matchup stats built into the platform. No more having to navigate to multiple sites. ',
            offerings: 'Perhaps because Sports Interaction is based in North America, it is the North American sports that are featured on the main pages. They have all major North American events, but actually have quite an impressive offering of many other global sports. Impressively, they also offer more obscure sports such as Gaelic Games, Lacrosse, and Cycling. Their soccer coverage is also quite extensive. There odds can be very hit or miss, but that is the norm for most books that aren’t Pinnacle. They do have good live betting coverage, but no streaming perks like William Hill or Bet 365. If you want a professional no frills setup, Sports Interaction is a great pick.',
            cashReview: 'Excellent. Quick withdrawals, without issue, and easy deposits allows Sports Interaction an Excellent Cashier rating.',
            customerService: 'Sports Interaction have one of the best Customer Service modules in the industry. Live Chat can be accessed 24 hours a day where a customer service agent will answer any of your questions. Sports Interaction can also be reached via email, fax, or telephone. Additionally, they also have a search feature for their FAQs page to answer some of the more common questions.',
            depositReview: 'All deposit methods are effective and will enable access to your funds in a timely manner. There are no charges for deposits.',
            withdrawalReview: 'One withdrawal per calendar month is free. Charges for additional withdrawals depend on the player’s location and the method used.',
            languages: [['English', 'French', 'Spanish']],
            screenshot: true
        },
        {
            name: 'William Hill',
            affiliateUrl: 'http://ads2.williamhill.com/redirect.aspx?pid=182612656&bid=1487410869&lpid=1470919664',
            depositMethods:[
                ['Credit Card', 'UK Debit Cards', 'Entropay',  'Paypal', 'UKash', 'Skrill', 'Neteller'],
                ['Click2Pay', 'Instadebit', 'William Hill Store', 'UseMyFunds', 'ClickandBuy', 'POLi', 'WebMoney']
            ],
            withdrawalMethods:[
                ['ClickandBuy', 'Maestrocard', 'Credit Card', 'Moneybookers', 'Neteller', 'UKash']

            ],
            bonus: true,
            newAccountBonus: '100% Match Bonus up to $100',
            bonuses: [
                {type:'New Account', bonus:'100% Match Bonus up to $100'}
            ],
            restricted: ['Belgium', 'France', 'Turkey', 'USA'],
            grade: 'B+',
            banner: $sce.trustAsHtml('<a href="http://ads2.williamhill.com/redirect.aspx?pid=182612656&bid=1487410869&lpid=1470919664"><img alt="" src="http://ads2.williamhill.com/renderimage.aspx?pid=182612656&bid=1487410869" border=0></img ></a>'),
            overview: 'William Hill is one of the most well known names in sports betting. Along with having a first class online offering, William Hill also has 624 betting outlets in the U.K., Ireland, and the Isle of Man. To further their reputation for financial stability and transparency, William Hill has been listed on the London Stock Exchange for 12 years. William Hill provides diverse offerings, covering most sporting events. William Hill can be described by one word: professionalism. William Hill are professional and above average in every category while not really excelling in anything. Their interface and customer service are amongst the best, however. In our opinion, William Hill is a great sports book for any user, professional or recreational. ',
            interface: ': In 2008, William Hill partnered with Playtech, who are one of the best gaming platform creators. As a result, there are now no problems around the William Hill software. It’s a very clean and straightforward production. The sports categories and wager options are clearly laid out. Helpfully, William Hill provides a bet slip on the right, a bet calculator, results, a customizable favorites tab, and a search bar to find the exact team or game you want to bet on. William Hill also provides live streaming for select events, which is ideal for in-play betting. William Hill also provides additional features that make it seem as if the platform is geared towards the recreational bettor. The platform features written content, radio, and podcasts. Their mobile website also deserves to be used as a blueprint, along with Bet 365, for how mobile sites should be built. We can only hope that the rest of the sports books on the net follow suit.',
            offerings: ': William Hill are amongst the biggest providers in regards to events to wager on. Their offerings cover more than 20 sports, and they are the most likely book to offer regional event coverage. Their odds are competitive, if not the best in the market for the user. There is plenty of variety and a wide range of options including results, scorers, time of score, exact score and number of points. William Hill has a robust and impressive live betting platform, but the events offered are geared towards soccer.',
            cashReview: 'Excellent. Any company that has been an industry leader since 1934 in an industry as volatile as sports betting is a reliable and financially stable corporation. Part of that is due to their excellent cashier system, where users rarely encounter any issues. William Hill has one of the most solid financial backgrounds in the sports betting industry, so players do not have to worry about payouts. Additionally, William Hill offers users the chance to wager in several currencies including, AUD, CAD, CHF, DKK, EUR, GBP, and USD.',
            customerService: 'William Hill provides excellent customer service, which is a requirement as a publically traded company. This helps ensure that there will rarely be any issues for the player as William Hill has a responsibility to their shareholders. There are hardly any issues that would require customer service, but that being said, the customer service phone number and live chat can be a bit difficult to find. It is easy to submit a written (e-mail) inquiry through the ‘contact us’ page, which will provide a reply in a timely manner. The easiest method to address any questions is via their extensive FAQs page, which is updated regularly and is likely to answer any inquiries. ',
            depositReview: 'There are many deposit methods, some which are regionally dependent. All deposit methods are effective and will enable access to your funds in a timely manner. There are no charges for deposits. Visa, Maestrocard, Mastercard, and Click and Buy require a minimum deposit of $10.',
            withdrawalReview: 'There are no surcharges for withdrawals. ',
            languages: [['English', 'French', 'German', 'Greek', 'Polish', 'Russian', 'Spanish']],
            screenshot: false
        }
    ];

    var getSportsbooks = function(callback){
        Location.getCountry(function(country){
            var sportsbooksOrdered = [];
            var rank = defaultRank;

            if(country in countryRank){
                rank = countryRank[country];
                while (rank.length < 10) {
                    for(var i=0; i< remainder.length; i++){
                        if(rank.indexOf(remainder[i]) === -1){
                            rank.push(remainder[i]);
                        }
                    }
                    for(var j=0; j<defaultRank.length; j++){
                        if(rank.indexOf(defaultRank[j]) === -1){
                            rank.push(defaultRank[j]);
                        }
                    }
                }
            }
            rank.forEach(function(key) {
                var found = false;
                sportsbooks.filter(function(sportsbook) {
                    if(!found && sportsbook.name === key) {
                        sportsbooksOrdered.push(sportsbook);
                        found = true;
                        return false;
                    } else
                        return true;
                });
            });
            callback(sportsbooksOrdered);
        });
    };

    var getSportsbook = function(sportsbookName){
        return $filter('filter')(sportsbooks, {name:sportsbookName})[0];
    };


    return {
        getSportsbooks: getSportsbooks,
        getSportsbook: getSportsbook
    };

}
]);