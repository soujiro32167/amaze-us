// @NamedQuery(name = "Reminders.findAll", query = "SELECT r FROM Reminders r")
//     , @NamedQuery(name = "Reminders.findById", query = "SELECT r FROM Reminders r WHERE r.id = :id")
//     , @NamedQuery(name = "Reminders.findByName", query = "SELECT r FROM Reminders r WHERE r.name = :name")
//     , @NamedQuery(name = "Reminders.findByDate", query = "SELECT r FROM Reminders r WHERE r.date = :date")
//     , @NamedQuery(name = "Reminders.findByIsComplete", query = "SELECT r FROM Reminders r WHERE r.isComplete = :isComplete")})

const mysql = require('mysql');
const promisify = require('util.promisify');
const util = require('./util')(mysql.escapeId);

// connection.connect();

// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });

// connection.end();

class RemindersDAO {
  constructor(options){
    this.options = Object.assign({
      mysql
    }, options);
    this.connect();
  }

  connect(){
    // TODO: KMS for credentials
    this.connectionPool = this.options.mysql.createPool({
      host     : 'jax-rs-db.cce8xk4qewtv.us-east-1.rds.amazonaws.com',
      user     : 'root',
      password : '12345678',
      database : 'reminders'
    });

    this.query = promisify(this.connectionPool.query.bind(this.connectionPool));
  }

  findAll(filters){
    return this.query('SELECT * FROM reminders r WHERE ' 
      + util.filterByAllSql(filters), Object.values(filters || {}));
  }

  findById(id){
    return this.findAll({id});
  }

  findByName(name){
    return this.findAll({name});
  }

  findByDate(date){
    return this.findAll({date});
  }

  findByIsComplete(isComplete){
    return this.findAll({isComplete});
  }

  createReminder(reminder){
    return this.query('INSERT INTO reminders SET ?', reminder);
  }

  updateReminder(id, reminder){
    return this.query('UPDATE reminders SET ? WHERE id = ?', [reminder, id]);
  }

  deleteReminder(id){
    return this.query('DELETE FROM reminders WHERE id = ?', id);
  }

  count(){
    return this.query('SELECT COUNT(*) as count FROM reminders');
  }
}

module.exports = {
  create: (options) => new RemindersDAO(options)
};