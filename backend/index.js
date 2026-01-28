const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
// const axios = require("axios");
// require("dotenv").config();

const HOTEL_LAT = 18.5018;
const HOTEL_LNG = 73.8636;

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// MySQL connection
// =======================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "feane_db",
});

db.connect((err) => {
  if (err) console.log("DB Error:", err);
  else console.log("MySQL Connected");
});

// =======================
// EMAIL SETUP
// =======================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ganeshbansode1221@gmail.com",
    pass: "vuui kezd muwf fhdf",
  },
});

transporter.verify((err) => {
  if (err) console.log("EMAIL CONFIG ERROR:", err);
  else console.log("Email server ready");
});

// =======================
// OTP
// =======================
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// =======================
// SEND OTP
// =======================
app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const otp = generateOTP();

  db.query(
    "INSERT INTO email_otp (email, otp) VALUES (?, ?)",
    [email, otp],
    async (err) => {
      if (err) return res.status(500).json({ message: "DB Error" });

      try {
        await transporter.sendMail({
          from: "ganeshbansode1221@gmail.com",
          to: email,
          subject: "OTP Verification",
          text: `Your OTP is ${otp}`,
        });
        res.json({ message: "OTP sent successfully" });
      } catch {
        res.status(500).json({ message: "Email sending failed" });
      }
    }
  );
});

// =======================
// VERIFY OTP
// =======================
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  db.query(
    "SELECT * FROM email_otp WHERE email=? AND otp=?",
    [email, otp],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB Error" });
      if (result.length === 0)
        return res.status(400).json({ message: "Invalid OTP" });

      res.json({ message: "Email verified successfully" });
    }
  );
});

// =======================
// CHECK AVAILABILITY
// =======================
app.get("/check-availability", (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Date required" });

  const TOTAL_TABLES = 5;

  const sql = `
    SELECT COUNT(*) AS booked
    FROM book_table
    WHERE booking_date = STR_TO_DATE(?, '%Y-%m-%dT%H:%i')
    AND status='BOOKED'
  `;

  db.query(sql, [date], (err, result) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    const available = TOTAL_TABLES - result[0].booked;

    res.json({
      available,
      message:
        available > 0
          ? `${available} tables available`
          : "No tables available",
    });
  });
});

// =======================
// BOOK TABLE
// =======================
app.post("/book-table", (req, res) => {
  const { name, phone, email, persons, date } = req.body;

  if (!name || !phone || !email || !persons || !date) {
    return res.status(400).json({ message: "All fields required" });
  }

  const TOTAL_TABLES = 5;

  // 1️⃣ SAME USER + SAME SLOT + BOOKED ? → BLOCK
  const userDuplicateSql = `
    SELECT id FROM book_table
    WHERE phone=?
    AND email=?
    AND booking_date = STR_TO_DATE(?, '%Y-%m-%dT%H:%i')
    AND status='BOOKED'
  `;

  db.query(userDuplicateSql, [phone, email, date], (err, userRows) => {
    if (err) return res.status(500).json({ message: "DB Error" });

    if (userRows.length > 0) {
      return res.status(400).json({
        message: "You already have a booking for this date and time",
      });
    }

    // 2️⃣ SLOT AVAILABILITY CHECK
    const slotSql = `
      SELECT COUNT(*) AS booked
      FROM book_table
      WHERE booking_date = STR_TO_DATE(?, '%Y-%m-%dT%H:%i')
      AND status='BOOKED'
    `;

    db.query(slotSql, [date], (err, result) => {
      if (err) return res.status(500).json({ message: "DB Error" });

      if (result[0].booked >= TOTAL_TABLES) {
        return res
          .status(400)
          .json({ message: "No tables available for this slot" });
      }

      // 3️⃣ REUSE CANCELLED BOOKING (IF EXISTS)
      const cancelledSql = `
        SELECT id FROM book_table
        WHERE booking_date = STR_TO_DATE(?, '%Y-%m-%dT%H:%i')
        AND status='CANCELLED'
        LIMIT 1
      `;

      db.query(cancelledSql, [date], (err, cancelled) => {
        if (err) return res.status(500).json({ message: "DB Error" });

        // 3a️⃣ UPDATE CANCELLED → BOOKED
        if (cancelled.length > 0) {
          const updateSql = `
            UPDATE book_table
            SET name=?, phone=?, email=?, persons=?, status='BOOKED'
            WHERE id=?
          `;

          db.query(
            updateSql,
            [name, phone, email, persons, cancelled[0].id],
            (err) => {
              if (err)
                return res.status(500).json({ message: "DB Error" });

              return res.json({ message: "Table booked successfully" });
            }
          );
        } else {
          // 3b️⃣ INSERT NEW BOOKING
          const insertSql = `
            INSERT INTO book_table
            (name, phone, email, persons, booking_date, status)
            VALUES (?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%dT%H:%i'), 'BOOKED')
          `;

          db.query(
            insertSql,
            [name, phone, email, persons, date],
            (err) => {
              if (err)
                return res.status(500).json({ message: "DB Error" });

              res.json({ message: "Table booked successfully" });
            }
          );
        }
      });
    });
  });
});

// =======================
// CANCEL BOOKING
// =======================
app.post("/cancel-booking", (req, res) => {
  const { email, date } = req.body;

  const sql = `
    UPDATE book_table
    SET status='CANCELLED'
    WHERE email=?
    AND booking_date = STR_TO_DATE(?, '%Y-%m-%dT%H:%i')
    AND status='BOOKED'
  `;

  db.query(sql, [email, date], (err, result) => {
    if (err) return res.status(500).json({ message: "DB Error" });
    if (result.affectedRows === 0)
      return res
        .status(400)
        .json({ message: "No active booking found" });

    res.json({ message: "Booking cancelled successfully" });
  });
});

// =======================
// PLACE ORDER API (KEEP)
// =======================
app.post("/api/order", (req, res) => {
  const { items, total, email, address } = req.body;

  if (!email || !address) {
    return res
      .status(400)
      .json({ success: false, message: "Missing user data" });
  }

  if (!items || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Cart is empty" });
  }

  const sql =
    "INSERT INTO orders (items, total, email, address) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [JSON.stringify(items), total, email.toLowerCase(), address],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Order failed",
        });
      }

      res.json({
        success: true,
        message: "Order placed successfully",
        orderId: result.insertId,
      });
    }
  );
});

// =======================
// GET ORDERS API (FIXED)
// =======================
app.get("/api/orders", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const sql = `
    SELECT *
    FROM orders
    WHERE email = ?
    ORDER BY id DESC
  `;

  db.query(sql, [email.toLowerCase()], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
      });
    }

    res.json({
      success: true,
      orders: results,
    });
  });
});


// check address

app.post("/api/check-address", (req, res) => {
  const { address, pincode } = req.body;

  if (!address || !pincode) {
    return res.json({
      allowed: false,
      message: "Address and pincode are required",
    });
  }

  const allowedPincodes = ["411002","411001", "411009", "411037", "411030"];
  const allowedAreas = [
    "pune",
    "swargate",
    "sadashiv peth",
    "parvati",
    "bibwewadi",
    "sahakar nagar",
    "camp",
    "sarasbaug",
  ];

  const lowerAddress = address.toLowerCase();

  const areaAllowed = allowedAreas.some(area =>
    lowerAddress.includes(area)
  );

  const pincodeAllowed = allowedPincodes.includes(pincode);

  if (!areaAllowed || !pincodeAllowed) {
    return res.json({
      allowed: false,
      message: "Delivery not available for this location",
    });
  }

  res.json({
    allowed: true,
    message: "Delivery available",
  });
});



//  favorite icon

app.post("/favourite/toggle", (req, res) => {
  const { userId, productId } = req.body;

  const checkSql =
    "SELECT * FROM favourites WHERE user_id=? AND product_id=?";

  db.query(checkSql, [userId, productId], (err, result) => {
    if (result.length > 0) {
      db.query(
        "DELETE FROM favourites WHERE user_id=? AND product_id=?",
        [userId, productId]
      );
      return res.json({ message: "Removed" });
    }

    db.query(
      "INSERT INTO favourites (user_id, product_id) VALUES (?,?)",
      [userId, productId]
    );
    res.json({ message: "Added" });
  });
});

// =======================
// SIGN UP
// =======================
app.post("/signup", (req, res) => {
  const { email, firstName, lastName, password } = req.body;

  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    "SELECT id FROM users WHERE email=?",
    [email],
    (err, result) => {
      if (err) {
        console.log("CHECK USER ERROR:", err);
        return res.status(500).json({ message: "Server error" });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }

      db.query(
        "INSERT INTO users (email, first_name, last_name, password) VALUES (?,?,?,?)",
        [email, firstName, lastName, password],
        (err) => {
          if (err) {
            console.log("INSERT USER ERROR:", err);
            return res.status(500).json({ message: "Server error" });
          }

          res.json({
  user: {
    id: result.insertId,
    email,
    first_name: firstName,
    last_name: lastName,
  },
});
        }
      );
    }
  );
});

// =======================
// LOGIN (FIXED)
// =======================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT id, email, first_name, last_name, password, role FROM users WHERE email=?",
    [email],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Server error" });

      if (result.length === 0) {
        return res.status(400).json({ message: "User not registered" });
      }

      if (result[0].password !== password) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      // ✅ RETURN ROLE PROPERLY
      res.json({
        user: {
          id: result[0].id,
          email: result[0].email,
          first_name: result[0].first_name,
          last_name: result[0].last_name,
          role: result[0].role,
        },
      });
    }
  );
});

// =======================
// ACCOUNT DETAILS - GET
// =======================
app.get("/api/account", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const sql = `
    SELECT 
      first_name AS firstName,
      last_name AS lastName,
      CONCAT(first_name, ' ', last_name) AS displayName,
      email
    FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log("ACCOUNT FETCH ERROR:", err);
      return res.status(500).json({ message: "DB error" });
    }

    if (result.length === 0) {
      return res.json({
        firstName: "",
        lastName: "",
        displayName: "",
        email,
      });
    }

    res.json(result[0]);
  });
});
// =======================
// ACCOUNT DETAILS - UPDATE
// =======================
app.put("/api/account/update", (req, res) => {
  const {
    email,
    firstName,
    lastName,
    currentPassword,
    newPassword,
  } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email required" });
  }

  // 1️⃣ Get existing password
  db.query(
    "SELECT password FROM users WHERE email=?",
    [email],
    (err, result) => {
      if (err) {
        console.log("FETCH PASS ERROR:", err);
        return res.json({ success: false });
      }

      if (result.length === 0) {
        return res.json({ success: false, message: "User not found" });
      }

      // 2️⃣ Verify current password (plain text – as per your DB)
      if (newPassword && result[0].password !== currentPassword) {
        return res.json({
          success: false,
          message: "Current password incorrect",
        });
      }

      // 3️⃣ Update profile (+ password only if provided)
      const sql = `
        UPDATE users
        SET first_name=?, last_name=?, password=?
        WHERE email=?
      `;

      const updatedPassword = newPassword
        ? newPassword
        : result[0].password;

      db.query(
        sql,
        [firstName, lastName, updatedPassword, email],
        (err) => {
          if (err) {
            console.log("UPDATE ERROR:", err);
            return res.json({ success: false });
          }

          res.json({ success: true });
        }
      );
    }
  );
});

// =======================
// ADMIN DASHBOARD STATS
// =======================
app.get("/admin/dashboard", (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS total FROM categories", (e1, r1) => {
    stats.categories = r1[0].total;

    db.query("SELECT COUNT(*) AS total FROM products", (e2, r2) => {
      stats.products = r2[0].total;

      db.query(
        "SELECT COUNT(*) AS total FROM products WHERE is_active=1",
        (e3, r3) => {
          stats.activeProducts = r3[0].total;
          res.json(stats);
        }
      );
    });
  });
});

app.get("/products/filter", (req, res) => {
  const { category, min, max } = req.query;

  let sql = `
    SELECT p.*
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active=1 AND c.is_active=1
  `;
  const params = [];

  if (category) {
    sql += " AND c.id=?";
    params.push(category);
  }

  if (min) {
    sql += " AND p.price >= ?";
    params.push(min);
  }

  if (max) {
    sql += " AND p.price <= ?";
    params.push(max);
  }

  db.query(sql, params, (err, rows) => {
    res.json(rows);
  });
});


// GET categories
app.get("/admin/categories", (req, res) => {
  db.query("SELECT * FROM categories", (err, rows) => {
    res.json(rows);
  });
});

// TOGGLE category
app.put("/admin/categories/:id/toggle", (req, res) => {
  db.query(
    "UPDATE categories SET is_active = !is_active WHERE id=?",
    [req.params.id],
    () => res.json({ success: true })
  );
});


app.listen(5000, () =>
  console.log("Server running on port 5000")
);

