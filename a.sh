npx sequelize-cli model:create --name user --attributes username:string,password:string,role:string --underscored
npx sequelize-cli model:create --name transaction_detail --attributes transaction_id:integer,package_id:integer,qty:integer --underscored
npx sequelize-cli model:create --name transaction --attributes member_id:integer,date:date,deadline:date,payment_date:date,progress_status:string,payment_status:string,user_id:integer --underscored
npx sequelize-cli model:create --name member --attributes name:string,address:string,gender:string,phone_number:string --underscored
npx sequelize-cli model:create --name package --attributes name:string,price:integer --underscored
