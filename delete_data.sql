 branch             | table | postgres
 member             | table | postgres
 membership         | table | postgres
 membership_fee     | table | postgres
 membership_payment | table | postgres
 membership_year    | table | postgres
 role               | table | postgres
 territory          | table | postgres
 territory_level

DELETE FROM member;
DELETE FROM membership;
DELETE FROM membership_fee;
DELETE FROM membership_payment;
DELETE FROM membership_year;
DELETE FROM role;
DELETE FROM territory;
DELETE FROM territory_level;
DELETE FROM branch;
