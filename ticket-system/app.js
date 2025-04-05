
const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const { Ticket } = require('./models'); 

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Подключение к базе данных 
const sequelize = new Sequelize('test_em', 'postgres', '1', {
  host: 'localhost',
  dialect: 'postgres'
});

// Проверка подключения к базе данных
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


// Маршруты 
app.post('/tickets', async (req, res) => {
    try {
      const { subject, description } = req.body;
      const ticket = await Ticket.create({
        subject,
        description,
        status: 'Новое'
      });
      res.status(201).json(ticket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Не удалось создать обращение' });
    }
  });
  app.put('/tickets/:id/start', async (req, res) => {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).json({ error: 'Обращение не найдено' });
      }
      ticket.status = 'В работе';
      await ticket.save();
      res.json(ticket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Не удалось взять обращение в работу' });
    }
  });
  app.put('/tickets/:id/complete', async (req, res) => {
    try {
      const { id } = req.params;
      const { resolution } = req.body;
      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).json({ error: 'Обращение не найдено' });
      }
      ticket.status = 'Завершено';
      ticket.resolution = resolution;
      await ticket.save();
      res.json(ticket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Не удалось завершить обращение' });
    }
  });
  app.put('/tickets/:id/cancel', async (req, res) => {
    try {
      const { id } = req.params;
      const { cancellationReason } = req.body;
      const ticket = await Ticket.findByPk(id);
      if (!ticket) {
        return res.status(404).json({ error: 'Обращение не найдено' });
      }
      ticket.status = 'Отменено';
      ticket.cancellationReason = cancellationReason;
      await ticket.save();
      res.json(ticket);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Не удалось отменить обращение' });
    }
  });
  app.get('/tickets', async (req, res) => {
    try {
      const { date, startDate, endDate } = req.query;
      let whereClause = {};
  
      if (date) {
        whereClause.createdAt = {
          [Sequelize.Op.eq]: new Date(date) // Поиск точного соответствия по дате
        };
      } else if (startDate && endDate) {
        whereClause.createdAt = {
          [Sequelize.Op.gte]: new Date(startDate), // >= startDate
          [Sequelize.Op.lte]: new Date(endDate)   // <= endDate
        };
      }
  
      const tickets = await Ticket.findAll({
        where: whereClause
      });
      res.json(tickets);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Не удалось получить список обращений' });
    }
  });
  app.put('/tickets/cancel-in-progress', async (req, res) => {
    try {
      const updatedTickets = await Ticket.update(
        { status: 'Отменено' },
        { where: { status: 'В работе' } }
      );
      res.json({ message: `Отменено ${updatedTickets[0]} обращений` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Не удалось отменить обращения' });
    }
  });

  
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});