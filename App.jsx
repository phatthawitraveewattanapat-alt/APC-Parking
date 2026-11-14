import React, { useState } from 'react';

const BLUE = '#087DBB';
const BG = '#F2F7FB';
const GREEN = '#169B70';
const RED = '#E84D5B';
const ORANGE = '#F59E0B';
const GRAY = '#718492';

const INITIAL_DATA = [
  { id: 'A', name: 'ลานจอดรถ A', location: 'อาคารเรียนรวม', total: 60, used: 18 },
  { id: 'B', name: 'ลานจอดรถ B', location: 'อาคารกิจกรรมนักศึกษา', total: 50, used: 38 },
  { id: 'C', name: 'ลานจอดรถ C', location: 'อาคารหอสมุด', total: 40, used: 40 },
  { id: 'D', name: 'ลานจอดรถ D', location: 'อาคารนวัตกรรม', total: 80, used: 28 },
];

const TABS = [
  { name: 'home', label: 'หน้าหลัก', icon: '🏠' },
  { name: 'map', label: 'แผนที่', icon: '🗺️' },
  { name: 'list', label: 'ที่จอดรถ', icon: '🅿️' },
  { name: 'notifications', label: 'แจ้งเตือน', icon: '🔔' },
  { name: 'profile', label: 'โปรไฟล์', icon: '👤' },
];

const TITLES = {
  home: 'APC Parking',
  map: 'แผนที่ที่จอดรถ',
  list: 'รายการที่จอดรถ',
  notifications: 'แจ้งเตือน',
  profile: 'โปรไฟล์',
  settings: 'ตั้งค่า',
  detail: 'รายละเอียด',
  update: 'อัปเดตสถานะ',
  history: 'ประวัติการจอดรถ',
};

const freeOf = (p) => p.total - p.used;

export default function App() {
  const [page, setPage] = useState('login');
  const [parking, setParking] = useState(INITIAL_DATA);
  const [selectedId, setSelectedId] = useState('A');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ไม่ว่าง');
  const [amount, setAmount] = useState('1');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notifications, setNotifications] = useState([
    { title: 'ยินดีต้อนรับสู่ APC Parking', detail: 'เริ่มค้นหาที่จอดรถได้เลย' },
  ]);
  const [history] = useState([
    { id: 1, spot: 'A', date: '2025-10-01 10:00', duration: '2 ชม.', amount: 40 },
    { id: 2, spot: 'B', date: '2025-10-05 14:30', duration: '1 ชม.', amount: 20 },
    { id: 3, spot: 'C', date: '2025-10-10 09:15', duration: '3 ชม.', amount: 60 },
  ]);

  const selected = parking.find((p) => p.id === selectedId) || parking[0];
  const filtered = parking.filter((p) =>
    (p.name + p.location).toLowerCase().includes(search.trim().toLowerCase())
  );

  function openDetail(id) {
    setSelectedId(id);
    setMessage('');
    setPage('detail');
  }

  function go(tab) {
    setMessage('');
    setPage(tab);
  }

  function login() {
    if (!email.trim() || !password.trim()) {
      setMessage('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    setMessage('');
    setPage('home');
  }

  function quickDemoLogin() {
    setEmail('demo@apc-parking.ac.th');
    setName('เจ้าลิงซน');
    setMessage('');
    setPage('home');
  }

  function register() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage('กรุณากรอกชื่อ อีเมล และรหัสผ่าน');
      return;
    }
    setMessage('');
    setPage('home');
  }

  function logout() {
    setMessage('');
    setPassword('');
    setPage('login');
  }

  function updateStatus() {
    const count = Number(amount);
    if (!Number.isInteger(count) || count < 1) {
      setMessage('กรุณากรอกจำนวนช่องเป็นเลขจำนวนเต็มตั้งแต่ 1 ขึ้นไป');
      return;
    }

    const current = parking.find((p) => p.id === selectedId);
    if (!current) return;

    let changed = 0;
    let newUsed = current.used;

    if (status === 'ว่าง') {
      changed = Math.min(count, current.used);
      newUsed = current.used - changed;
    } else if (status === 'ไม่ว่าง') {
      changed = Math.min(count, current.total - current.used);
      newUsed = current.used + changed;
    } else {
      changed = current.total - current.used;
      newUsed = current.total;
    }

    if (status !== 'เต็ม' && changed === 0) {
      setMessage(
        status === 'ว่าง'
          ? 'ไม่มีช่องที่กำลังใช้งานให้เปลี่ยนเป็นว่าง'
          : 'ไม่มีช่องว่างเหลือให้เปลี่ยนเป็นไม่ว่าง'
      );
      return;
    }

    setParking((old) =>
      old.map((p) => (p.id === selectedId ? { ...p, used: newUsed } : p))
    );

    setNotifications((old) => [
      {
        title: 'อัปเดต ' + current.name,
        detail: 'สถานะ ' + status + ' จำนวน ' + changed + ' ช่อง',
      },
      ...old,
    ]);

    setMessage('อัปเดตสถานะเรียบร้อย');
    setPage('list');
  }

  const styles = {
    container: {
      maxWidth: '480px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: BG,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 0 24px rgba(0,0,0,0.08)',
      position: 'relative',
    },
    header: {
      height: '57px',
      backgroundColor: BLUE,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      color: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
    headerTitle: { fontSize: '17px', fontWeight: 'bold', flex: 1, marginLeft: '12px' },
    content: { flex: 1, paddingBottom: '80px', overflowY: 'auto' },
    hero: {
      backgroundColor: BLUE,
      padding: '20px',
      paddingBottom: '24px',
      borderBottomLeftRadius: '24px',
      borderBottomRightRadius: '24px',
      color: '#fff',
    },
    search: {
      width: '100%',
      backgroundColor: '#fff',
      height: '46px',
      borderRadius: '12px',
      padding: '0 13px',
      marginTop: '18px',
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      color: '#263D4D',
    },
    section: { padding: '16px' },
    heading: { fontSize: '17px', fontWeight: 'bold', color: '#20394C', marginBottom: '12px' },
    row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    summary: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: '13px',
      padding: '10px',
      textAlign: 'center',
      marginRight: '6px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
    },
    summaryNumber: { color: BLUE, fontWeight: 'bold', fontSize: '23px' },
    card: {
      backgroundColor: '#fff',
      borderRadius: '14px',
      padding: '14px',
      marginTop: '11px',
      border: '1px solid #E5EDF2',
      cursor: 'pointer',
    },
    selectedCard: { borderColor: BLUE, backgroundColor: '#EAF7FF' },
    cardTitle: { color: '#263D4D', fontSize: '14px', fontWeight: 'bold' },
    muted: { color: '#7B8E9C', fontSize: '12px', marginTop: '5px' },
    progressBg: {
      height: '7px',
      backgroundColor: '#E6EDF1',
      borderRadius: '8px',
      marginTop: '10px',
      overflow: 'hidden',
    },
    progress: { height: '7px', borderRadius: '8px', transition: 'width 0.3s ease' },
    map: {
      height: '240px',
      backgroundColor: '#E4F1E6',
      borderRadius: '16px',
      position: 'relative',
      margin: '12px 0',
      border: '1px solid #D1E5D5',
      overflow: 'hidden',
    },
    roadH: {
      position: 'absolute',
      width: '100%',
      height: '12px',
      backgroundColor: '#FFFDF3',
    },
    roadV: {
      position: 'absolute',
      width: '10px',
      height: '100%',
      backgroundColor: '#FFFDF3',
    },
    pin: {
      position: 'absolute',
      minWidth: '36px',
      height: '36px',
      borderRadius: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid #fff',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '12px',
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
    },
    mapCaption: {
      position: 'absolute',
      bottom: '8px',
      left: '8px',
      backgroundColor: '#fff',
      padding: '6px 9px',
      borderRadius: '7px',
      color: '#526D7D',
      fontSize: '10px',
    },
    detailBox: {
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '22px',
      margin: '14px 0',
      textAlign: 'center',
      border: '1px solid #E5EDF2',
    },
    bigNumber: { color: GREEN, fontWeight: 'bold', fontSize: '48px', margin: '8px 0' },
    button: {
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      textAlign: 'center',
      marginTop: '12px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      color: '#fff',
    },
    outlineButton: {
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      textAlign: 'center',
      marginTop: '10px',
      border: `1px solid ${BLUE}`,
      backgroundColor: '#fff',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      color: BLUE,
    },
    input: {
      width: '100%',
      backgroundColor: '#fff',
      borderRadius: '11px',
      height: '47px',
      padding: '0 13px',
      border: '1px solid #DCE6ED',
      marginTop: '10px',
      fontSize: '14px',
      outline: 'none',
      color: '#263D4D',
    },
    bottomBar: {
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      height: '63px',
      backgroundColor: '#fff',
      borderTop: '1px solid #E3EBF0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 10,
    },
    tab: {
      flex: 1,
      textAlign: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px 0',
    },
    tabIcon: { fontSize: '20px', display: 'block' },
    tabLabel: { fontSize: '10px', marginTop: '3px', display: 'block' },
    authPage: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '22px',
      minHeight: '100vh',
    },
    message: { color: RED, marginTop: '12px', fontSize: '12px' },
    link: {
      color: BLUE,
      fontSize: '12px',
      fontWeight: 'bold',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    },
  };

  const renderCard = (p) => {
    const available = freeOf(p);
    const percent = p.total > 0 ? (p.used / p.total) * 100 : 0;
    return (
      <div key={p.id} style={styles.card} onClick={() => openDetail(p.id)}>
        <div style={styles.row}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '28px', marginRight: '12px' }}>🅿️</span>
            <div>
              <div style={styles.cardTitle}>{p.name}</div>
              <div style={styles.muted}>{p.location}</div>
            </div>
          </div>
          <span style={{ color: BLUE, fontSize: '25px' }}>›</span>
        </div>
        <div style={{ ...styles.row, marginTop: '14px' }}>
          <span style={{ color: available === 0 ? RED : GREEN, fontWeight: 'bold', fontSize: '13px' }}>
            {available === 0 ? 'เต็มแล้ว' : 'ว่าง ' + available + ' ช่อง'}
          </span>
          <span style={styles.muted}>
            ใช้งาน {p.used}/{p.total}
          </span>
        </div>
        <div style={styles.progressBg}>
          <div
            style={{
              ...styles.progress,
              width: `${percent}%`,
              backgroundColor: available === 0 ? RED : percent >= 75 ? ORANGE : GREEN,
            }}
          />
        </div>
      </div>
    );
  };

  const renderMapView = () => {
    const pins = [
      { id: 'A', left: '10%', top: '12%' },
      { id: 'B', left: '70%', top: '15%' },
      { id: 'C', left: '42%', top: '48%' },
      { id: 'D', left: '72%', top: '72%' },
    ];
    return (
      <div style={styles.map}>
        <div style={{ ...styles.roadH, top: '55px' }} />
        <div style={{ ...styles.roadH, top: '145px' }} />
        <div style={{ ...styles.roadV, left: '28%' }} />
        <div style={{ ...styles.roadV, left: '67%' }} />
        {pins.map((pin) => {
          const spot = parking.find((p) => p.id === pin.id);
          return (
            <div
              key={pin.id}
              onClick={() => openDetail(pin.id)}
              style={{
                ...styles.pin,
                left: pin.left,
                top: pin.top,
                backgroundColor: spot && freeOf(spot) > 0 ? GREEN : RED,
              }}
            >
              P{pin.id}
            </div>
          );
        })}
        <div style={styles.mapCaption}>แผนที่จำลอง · แตะ P เพื่อดูรายละเอียด</div>
      </div>
    );
  };

  if (page === 'login' || page === 'register') {
    return (
      <div style={styles.container}>
        <div style={styles.authPage}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <div style={{ fontSize: '38px', fontWeight: 'bold', color: BLUE }}>🅿️ APC</div>
            <div style={{ fontSize: '30px', fontWeight: 'bold', color: ORANGE, marginBottom: '6px' }}>
              Parking
            </div>
            <div style={styles.muted}>เช็กที่จอดรถในมหาวิทยาลัย</div>
          </div>
          <div style={{ ...styles.card, padding: '20px', cursor: 'default' }}>
            <div style={{ fontSize: '23px', fontWeight: 'bold', color: '#164B70', marginBottom: '4px' }}>
              {page === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </div>
            <div style={{ ...styles.muted, marginBottom: '8px' }}>
              {page === 'login' ? 'ยินดีต้อนรับกลับมา!' : 'สร้างบัญชีเพื่อใช้งาน APC Parking'}
            </div>
            {page === 'register' && (
              <input
                style={styles.input}
                placeholder="ชื่อ-นามสกุล"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            {page === 'register' && (
              <input
                style={styles.input}
                placeholder="เบอร์โทรศัพท์"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            )}
            <input
              style={styles.input}
              placeholder="อีเมล หรือเบอร์โทรศัพท์"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              style={styles.input}
              type="password"
              placeholder="รหัสผ่าน"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {page === 'login' && (
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <button
                  style={styles.link}
                  onClick={() => setMessage('ลืมรหัสผ่าน: กรุณาติดต่อเจ้าหน้าที่อาคาร')}
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
            )}

            {!!message && <div style={styles.message}>{message}</div>}

            <button
              style={{ ...styles.button, backgroundColor: BLUE, marginTop: '16px' }}
              onClick={page === 'login' ? login : register}
            >
              {page === 'login' ? 'เข้าสู่ระบบ' : 'ลงทะเบียน'}
            </button>

            {page === 'login' && (
              <button
                style={{ ...styles.button, backgroundColor: GREEN, marginTop: '10px' }}
                onClick={quickDemoLogin}
              >
                ทดลองเข้าใช้งานทันที (Demo)
              </button>
            )}

            <div style={{ textAlign: 'center', color: '#718497', marginTop: '18px', fontSize: '12px' }}>
              {page === 'login' ? 'ยังไม่มีบัญชีใช่ไหม?' : 'มีบัญชีอยู่แล้ว?'}
            </div>
            <button
              style={styles.outlineButton}
              onClick={() => {
                setMessage('');
                setPage(page === 'login' ? 'register' : 'login');
              }}
            >
              {page === 'login' ? 'สมัครสมาชิก' : 'กลับไปหน้าเข้าสู่ระบบ'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>🅿️ APC</span>
        <span style={styles.headerTitle}>{TITLES[page] || 'APC Parking'}</span>
        <button
          onClick={() => go('notifications')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
        >
          🔔
        </button>
      </div>

      <div style={styles.content}>
        {page === 'home' && (
          <>
            <div style={styles.hero}>
              <div style={{ color: '#C5EFFF', fontSize: '11px', letterSpacing: '2px' }}>
                SMART CAMPUS
              </div>
              <div style={{ color: '#fff', fontSize: '27px', fontWeight: 'bold', marginTop: '5px' }}>
                APC Parking 🚗
              </div>
              <div style={{ color: '#E5F5FF', marginTop: '7px', fontSize: '13px' }}>
                ค้นหาที่จอดรถได้ง่าย ๆ
              </div>
              <input
                style={styles.search}
                placeholder="ค้นหาลานจอดรถหรืออาคาร..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={styles.section}>
              <div style={styles.heading}>ภาพรวมที่จอดรถ</div>
              <div style={styles.row}>
                <div style={styles.summary}>
                  <div style={styles.summaryNumber}>
                    {parking.reduce((s, p) => s + freeOf(p), 0)}
                  </div>
                  <div style={styles.muted}>ช่องว่าง</div>
                </div>
                <div style={styles.summary}>
                  <div style={styles.summaryNumber}>
                    {parking.reduce((s, p) => s + p.used, 0)}
                  </div>
                  <div style={styles.muted}>ใช้งานแล้ว</div>
                </div>
                <div style={{ ...styles.summary, marginRight: 0 }}>
                  <div style={styles.summaryNumber}>{parking.length}</div>
                  <div style={styles.muted}>ลานจอดรถ</div>
                </div>
              </div>
              <div style={{ ...styles.heading, marginTop: '22px' }}>แผนที่ที่จอดรถ</div>
              {renderMapView()}
              <div style={styles.row}>
                <div style={styles.heading}>ลานจอดรถ</div>
                <button style={styles.link} onClick={() => go('list')}>
                  ดูทั้งหมด ›
                </button>
              </div>
              {filtered.map((p) => renderCard(p))}
              {filtered.length === 0 && (
                <div style={styles.muted}>ไม่พบลานจอดรถที่ค้นหา</div>
              )}
            </div>
          </>
        )}

        {page === 'list' && (
          <div style={styles.section}>
            <div style={{ fontSize: '23px', fontWeight: 'bold', color: BLUE, marginBottom: '10px' }}>
              รายการที่จอดรถ
            </div>
            <input
              style={styles.input}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาลานจอดรถหรืออาคาร..."
            />
            {filtered.map((p) => renderCard(p))}
            {filtered.length === 0 && <div style={styles.muted}>ไม่พบลานจอดรถ</div>}
          </div>
        )}

        {page === 'map' && (
          <div style={styles.section}>
            <div style={{ fontSize: '23px', fontWeight: 'bold', color: BLUE, marginBottom: '10px' }}>
              แผนที่ที่จอดรถ
            </div>
            {renderMapView()}
            {parking.map((p) => renderCard(p))}
          </div>
        )}

        {page === 'detail' && (
          <div style={styles.section}>
            <div style={{ fontSize: '23px', fontWeight: 'bold', color: BLUE }}>{selected.name}</div>
            <div style={styles.muted}>{selected.location}</div>
            {renderMapView()}
            <div style={styles.detailBox}>
              <div style={styles.muted}>ช่องจอดรถว่าง</div>
              <div style={styles.bigNumber}>{freeOf(selected)}</div>
              <div style={styles.muted}>ทั้งหมด {selected.total} ช่อง</div>
              <div style={styles.muted}>ใช้งานแล้ว {selected.used} ช่อง</div>
            </div>
            <button
              style={{ ...styles.button, backgroundColor: ORANGE }}
              onClick={() => {
                setMessage('');
                setPage('update');
              }}
            >
              อัปเดตสถานะที่จอดรถ
            </button>
            <button
              style={{ ...styles.button, backgroundColor: GRAY }}
              onClick={() => go('list')}
            >
              กลับไปรายการที่จอดรถ
            </button>
          </div>
        )}

        {page === 'update' && (
          <div style={styles.section}>
            <div style={{ fontSize: '23px', fontWeight: 'bold', color: BLUE, marginBottom: '10px' }}>
              อัปเดตสถานะ
            </div>
            <div style={styles.muted}>เลือกลานจอดรถ</div>
            {parking.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                style={{
                  ...styles.card,
                  ...(selectedId === p.id ? styles.selectedCard : {}),
                }}
              >
                <div style={styles.cardTitle}>
                  {selectedId === p.id ? '🔵 ' : '⚪ '}
                  {p.name}
                </div>
                <div style={styles.muted}>ว่าง {freeOf(p)} ช่อง</div>
              </div>
            ))}
            <div style={{ ...styles.heading, marginTop: '18px' }}>สถานะที่ต้องการตั้ง</div>
            {['ว่าง', 'ไม่ว่าง', 'เต็ม'].map((s) => (
              <div
                key={s}
                onClick={() => setStatus(s)}
                style={{ ...styles.card, ...(status === s ? styles.selectedCard : {}) }}
              >
                <div style={styles.cardTitle}>
                  {status === s ? '🔵 ' : '⚪ '}
                  {s}
                </div>
              </div>
            ))}
            <div style={{ ...styles.heading, marginTop: '18px' }}>
              จำนวนช่อง (ใช้กับสถานะว่าง/ไม่ว่าง)
            </div>
            <input
              style={styles.input}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="จำนวนช่อง"
            />
            {!!message && <div style={styles.message}>{message}</div>}
            <button
              style={{ ...styles.button, backgroundColor: GREEN }}
              onClick={updateStatus}
            >
              ยืนยันการอัปเดต
            </button>
            <button
              style={{ ...styles.button, backgroundColor: GRAY }}
              onClick={() => go('detail')}
            >
              ยกเลิก
            </button>
          </div>
        )}

        {page === 'notifications' && (
          <div style={styles.section}>
            <div style={{ fontSize: '23px', fontWeight: 'bold', color: BLUE, marginBottom: '10px' }}>
              การแจ้งเตือน
            </div>
            {notifications.map((n, i) => (
              <div key={i} style={{ ...styles.card, cursor: 'default' }}>
                <div style={styles.cardTitle}>🔔 {n.title}</div>
                <div style={styles.muted}>{n.detail}</div>
              </div>
            ))}
          </div>
        )}

        {page === 'profile' && (
          <div style={styles.section}>
            <div style={{ fontSize: '23px', fontWeight: 'bold', color: BLUE, marginBottom: '10px' }}>
              โปรไฟล์
            </div>
            <div style={styles.detailBox}>
              <div style={{ fontSize: '48px' }}>👤</div>
              <div style={styles.cardTitle}>{name.trim() || 'ผู้ใช้งานทั่วไป'}</div>
              <div style={styles.muted}>{email.trim() || 'ยังไม่ได้เชื่อมต่อระบบบัญชี'}</div>
              {!!phone.trim() && <div style={styles.muted}>{phone}</div>}
            </div>
            <button
              style={{ ...styles.button, backgroundColor: BLUE }}
              onClick={() => go('history')}
            >
              ประวัติการจอดรถ
            </button>
            <button
              style={{ ...styles.button, backgroundColor: BLUE }}
              onClick={() => go('settings')}
            >
              ตั้งค่า
            </button>
            <button
              style={{ ...styles.button, backgroundColor: RED }}
              onClick={logout}
            >
              ออกจากระบบ
            </button>
          </div>
        )}

        {page === 'history' && (
          <div style={styles.section}>
            <div style={{ fontSize: '23px', fontWeight: 'bold', color: BLUE, marginBottom: '10px' }}>
              ประวัติการจอดรถ
            </div>
            {history.map((item) => (
              <div key={item.id} style={{ ...styles.card, cursor: 'default' }}>
                <div style={styles.row}>
                  <div style={styles.cardTitle}>ช่องจอด {item.spot}</div>
                  <div style={{ color: BLUE, fontWeight: 'bold' }}>{item.amount} บาท</div>
                </div>
                <div style={{ ...styles.row, marginTop: '6px' }}>
                  <div style={styles.muted}>{item.date}</div>
                  <div style={styles.muted}>{item.duration}</div>
                </div>
              </div>
            ))}
            <button
              style={{ ...styles.button, backgroundColor: GRAY }}
              onClick={() => go('profile')}
            >
              กลับไปหน้าโปรไฟล์
            </button>
          </div>
        )}

        {page === 'settings' && (
          <div style={styles.section}>
            <div style={{ fontSize: '23px', fontWeight: 'bold', color: BLUE, marginBottom: '10px' }}>
              เกี่ยวกับแอป
            </div>
            <div style={{ ...styles.card, cursor: 'default' }}>
              <div style={styles.cardTitle}>APC Parking</div>
              <div style={styles.muted}>เวอร์ชัน 1.0.0</div>
              <div style={styles.muted}>ระบบต้นแบบสำหรับค้นหาที่จอดรถ</div>
              <div style={styles.muted}>ข้อมูลตัวอย่างใช้เพื่อการสาธิตเท่านั้น</div>
            </div>
            <button
              style={{ ...styles.button, backgroundColor: GRAY }}
              onClick={() => go('profile')}
            >
              กลับไปหน้าโปรไฟล์
            </button>
          </div>
        )}
      </div>

      <div style={styles.bottomBar}>
        {TABS.map((t) => (
          <button key={t.name} style={styles.tab} onClick={() => go(t.name)}>
            <span style={{ ...styles.tabIcon, color: page === t.name ? BLUE : '#8194A1' }}>
              {t.icon}
            </span>
            <span
              style={{
                ...styles.tabLabel,
                color: page === t.name ? BLUE : '#8194A1',
                fontWeight: page === t.name ? 'bold' : 'normal',
              }}
            >
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
