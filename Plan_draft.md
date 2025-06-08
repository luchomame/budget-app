1. What problem am I solving?
    - Currently I use a variety of spreadsheets for my budget. while I love the functionality of the spreadsheets and the availability, I think they're a bit bland and lack visuals to make them really impactful. 
    - I want to create a budget app to visualize my spending and have a better experience with my money. It gives me a better feel for whats going on 
    - I want to use this to track not just my spending but also my debts as I work to payoff my credit cards 

2. What are my must-have features?
    - I want to be able to log paychecks. 
    - Divide paychecks
        - I currently divide my paycheck into two accounts, USAA and Chase.
        - my spreadsheets work off this functionality. I wanna mimick this 
    - List out expenses and be able to add notes 
        - I must be able list out expenses like rent, utilities, car insurance, etc. 
        - I like adding notes to expenses so I can remember important info. 
    - Divide up expenses between accounts
        - I divide up items between bank account and credit card for things that make sense
            - bank account for bill autopay discounts
            - credit card to maximize points 
    - Divide up expenses between monthly and bi-monthly expenses
        - I currently get paid twice a month. I like to divide up the bills for the next month in 2 installments after I get paid 
        - I want to be able to divide up half the month's expenses in one check and the other half in the other 
    - Divide up expenses with items that are recurrent 
    - List out debts 
        - I want to be able to list out my current debts 
    - Project debt payoffs
        - I wanna be able to project the payoff time for my debts 
    - Savings info
        - I wanna be able to to list out my savings. I'm thinking of adding them as different categories. so think "savings", "extra savings", "savings for CC", "savings for trip", etc. 
            - so something to give me the most flexibility
    - Stock/investment info 
        - I want to have an option to include stocks and other saving categories. similar to savings info. I'll do something like "stocks", "roth IRA", "CDs", etc.
    - Visualize amount being taken from check 
        - so this will include bills, savings, etc. 
        - obviously priority bills 
    - Visualize spend with chart and graphs
        - I am thinking of having something in the home page as a quick view
            - like two circle graphs, one showing money in and other money out 
                - or maybe the money out be expenses and as we add expenses it increases 
                - green for money in > money out 
                - red for money in < money out 
    - Track expenses
        - manually add things I've spent money on 
            - so credit card charges, bills, etc.
        - compare with money in 
    - divide expenses
        - not just divide by USAA or Chase but also include different CCs 
            - I have CSP, Freedom flex, and freedom unlimited which I use for points 
            - have other CCs and could track by them but thats more important 
    - Add accounts
        - be able to add savings account amount 
            - prob manually right now 
    - Link payments to CC debt
        - currently have autopay setup for CC debt. would want this to be linked so it shows that it comes from my paycheck and the debt goes down
    - must allow for fun money
        - need to also set aside money to be able to spend for whatever like date nights and so on 
        - will count as an expense but not sure if it should be recurrent or what 
    - MUST be able to project what my money will be END OF MONTH 
        - if for whatever reason it doesn't add up, it'll be a great indicator for me losing money somewhere
    - Divide up projected amount by account
        - Chase vs USAA
    - I want to have automatic updating 

3. What are nice-to-haves?
    - Spend over time 
        - comparisons to how I've been spending every month 
    - Use APIs to track expenses automatically 
    - Add accounts automatically
        - a deeper link
        - not sure if API to do this but this link will include real time updates to savings or investing or whatever 
    - Mark or categorize expenses
        - could be beneficial to say "XX was used for fun money" so like a category

4. What are the main screens or views?
    - I need a dashboard to see everything 
    - I want eye poppnig things in the home page 
        - so like important numbers where I can then drill down and see other things 
    - reusable patterns to add things
        - so the same pattern for Savings table add would work for investments and for expense add 
            - start with category, $, and notes. add extra cols if needed for the specific stuff 
    - Need bank adding view 
        - so a form to add the info. at the start can be manual 
    - Need savings adding view 
        - form to add a savings category. I want it to work like a spreadsheet but the view in the app would be cleaner 
    - View for savings, debt, and investment
        - be able to visualize the spend and other items. I'm sure we can re-use it for savings, debt, and investment 
    - Visualize recurrent charges 

5. What Data do I need to store?
    - If I add a paycheck, I need to set if it is a recurrent check or not.
        - I think to start I only wanna include recurrent payments and things like that ya know? 
    - I can make a couple buckets and link things there 
        1. Available money 
            - comes from paychecks. recurrent one. need to track when they come in or expected to come in for auto transfers 
        2. Debt 
            - add cc debt in another page. this can contribute to total debt and that will be this bucket 
            - this bucket will not directly discount from my available money, but it can show my net worth can be - whatever if debt > available money 
        3. Expenses 
            - add CC charges and other items into this.
            - this bucket will directly compete with available money. ideally it'll be how I spend my monthly paychecks
            - can include autopay payments to CC
                - autopay payments to CC would obviously discount debt bucket by discounting cc debt for specific CC 
        4. Savings 
            - this also counts as a postivie towards net worth 
            - this is a negative towards available money bc it discounts it 
            - is not considered an expense or debt 
        5. Investing
            - similar to Savings, counts as positive towards net worth 
            - negative towards available money 
            - not considered expense or debt 
        6. Fun Money
            - considered as an expense but special type
            - may need to mark it as fun money if I wanna give the option to mark items 
        7. Net worth
            - overall worth based on savings accounts added and money in bank accounts

6. How do these pieces connect?
    - Using buckets, 
        - Debt does not directly influence Available money 
        - Expenses discount from Available money 
        - Savigs discount from Available money
        - Investing discount from Available money
        - Fun Money discount from Available money
        - Debt discount from Net Worth 

7. Whats my MVP?
    - I wanna feel like I moved out of spreadsheets. 
        - there must be visualizations to catch the eye and inform at a glance. 
        - I want it include what my spreadsheets already do 
            - list out paycheck by paycheck and monthly (2 paychecks)
            - list out expenses
                - by account, by monthly and per check 
            - list out recurrent bills 
                - just need to know the monthly. can handle by monthly and per check later 
            - list out savings 
                - different savings categories, per check and monthly
            - list out investments 

8. What Tech am I using and why?
    - I have experience building web apps and react native
        - more experience with web apps 
    - would like to explore different frameworks than the stuff from work
        - so thinking of using Remix for webapp
    - it makes more sense to make the app accessible natively to the phone
        - don't know how PWA works  
    - thinking of doing
        - webapp
            - remix + supabase
                - use shadcn for components and modify based on device 
            - - can host in Render for quick deploy
        - PWA
            - remix + supabase too 
                - I think just need to add a config file? and whatever is involved 
            - can host in Render for quick deploy or even use Fly.io to try something new 
        - Android app
            - react native + supabase 
                - react native would require a rewrite or a wrapper but I like this 
            - can host in EAS 

9. Do I care about design yet?
    - I am interested in design but I'll focus more on Shadcn 
        - will use predifined templates and so on 
    - I think focusing on routes and logic is best and then focus on design a lot more after thats working
        - so have pages ready with component library. then dig more into that later 

10. What excites you?
    - I like beautiful interfaces 
    - I like building something interesting that I personally will use 
    - I love google sheets and excel, but I wanna move this out there to test and get experience elsewhere 
    - I love trying new tech and this will be a great way to do this and add it in github to puff up my portfolio site 
    - Would LOVE to add data analyst shit like ML or whatever would be fun and free