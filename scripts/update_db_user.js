const fs = require('fs');

const db = JSON.parse(fs.readFileSync('server/db.json', 'utf8'));

if (db.user) {
  db.user.id = 'EPY31650';
  db.user.name = 'Nirod Behera';
  db.user.firstName = 'Nirod';
  db.user.lastName = 'Behera';
  db.user.mobile = '7013893165';
  db.user.maskedMobile = 'xxxxxx3165';
  db.user.email = 'nirodbehera@gmail.com';
  db.user.payId = '7013893165@easypay';

  if (Array.isArray(db.user.paymentDetails)) {
    db.user.paymentDetails.forEach(p => {
      if (p.holderName) {
        p.holderName = 'NIROD BEHERA';
      }
    });
  }
}

fs.writeFileSync('server/db.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully updated server/db.json');
