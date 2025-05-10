// ussd-simulator.js
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let session = {
  phoneNumber: '+237650248351',
  currentMenu: 'main',
  balance: 1250
};

function showMenu() {
  switch(session.currentMenu) {
    case 'main':
      console.log(`CON Welcome to NkwaPay
1. Check Balance
2. Send Money
3. Buy Airtime
4. Exit`);
      break;
      
    case 'balance':
      console.log(`END Your balance: XAF ${session.balance}`);
      session.currentMenu = 'main';
      break;
      
    case 'send_money':
      console.log('CON Enter recipient phone:');
      break;
      
    case 'confirm_send':
      console.log(`CON Send XAF ${session.amount} to ${session.recipient}?
1. Confirm
2. Cancel`);
      break;
  }
}

function handleInput(input) {
  input = input.trim();
  
  if (session.currentMenu === 'main') {
    switch(input) {
      case '1': 
        session.currentMenu = 'balance';
        break;
      case '2':
        session.currentMenu = 'send_money';
        break;
      case '3':
        console.log('END Service coming soon');
        process.exit();
      case '4':
        process.exit();
      default:
        console.log('END Invalid option');
        process.exit();
    }
  }
  else if (session.currentMenu === 'send_money') {
    session.recipient = input;
    session.currentMenu = 'amount';
    console.log('CON Enter amount:');
  }
  else if (session.currentMenu === 'amount') {
    session.amount = input;
    session.currentMenu = 'confirm_send';
  }
  else if (session.currentMenu === 'confirm_send' && input === '1') {
    console.log(`END Sent XAF ${session.amount} to ${session.recipient}`);
    process.exit();
  }
  
  showMenu();
}

console.log('Simulating USSD request...\n');
showMenu();

rl.on('line', (input) => {
  handleInput(input);
});
