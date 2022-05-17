npx sequelize-cli model:create --name User --attributes username:string,password:string,role:string
npx sequelize-cli model:create --name TransactionDetail --attributes transactionId:integer,packageId:integer,qty:integer
npx sequelize-cli model:create --name Transaction --attributes memberId:integer,date:date,deadline:date,paymentDate:date,progressStatus:string,paymentStatus:string,userId:integer
npx sequelize-cli model:create --name Member --attributes name:string,address:string,gender:string,phoneNumber:string
npx sequelize-cli model:create --name Package --attributes name:string,price:integer
