import React, { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, LogIn, UserPlus, Calendar, FileText, 
  ShieldAlert, CheckCircle, Clock, Trash2, Edit, Plus, LogOut, 
  MapPin, User as UserIcon, Phone, Mail, Lock, AlertCircle 
} from 'lucide-react';
import { 
  registerUser, loginUser, sendTiffinRequest, getNotes, 
  getAllRequests, updateUser, deleteUser, addDailyMenu, postNote, getDailyMenu 
} from './services/api';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tiffin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem('tiffin_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tiffin_user');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-orange-600 shadow-md text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => user && setActiveTab('dashboard')}>
            <UtensilsCrossed className="w-8 h-8" />
            <span className="text-xl font-bold tracking-wide">Vaibhav Mess & Tiffin</span>
          </div>
          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm bg-orange-700 px-3 py-1 rounded-full font-medium">
                  {user.username} ({user.role})
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-white text-orange-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-orange-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <button 
                  onClick={() => setActiveTab('login')}
                  className={`px-4 py-1.5 rounded-lg font-medium transition ${activeTab === 'login' ? 'bg-white text-orange-600 shadow' : 'hover:bg-orange-700'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => setActiveTab('register')}
                  className={`px-4 py-1.5 rounded-lg font-medium transition ${activeTab === 'register' ? 'bg-white text-orange-600 shadow' : 'hover:bg-orange-700'}`}
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!user ? (
          activeTab === 'login' ? <Login setUser={setUser} /> : <Register setActiveTab={setActiveTab} />
        ) : (
          user.role === 'ADMIN' ? <AdminDashboard /> : <UserDashboard user={user} />
        )}
      </main>
    </div>
  );
}

/* ================= 1. LOGIN COMPONENT ================= */
function Login({ setUser }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (form.username === 'Vaibhav Bakal' && form.password === '04112000') {
        const adminUser = {
          id: 0,
          username: 'Vaibhav Bakal',
          emailId: 'vaibhavbakal555@gmail.com',
          role: 'ADMIN',
          address: 'Admin Headquarters'
        };
        setUser(adminUser);
        return;
      }

      const res = await loginUser(form.username, form.password);
      const loggedInUser = res.data.data;
      loggedInUser.role = 'USER';
      setUser(loggedInUser);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-slate-100 p-8 mt-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
        <p className="text-sm text-slate-500">Sign in to manage your tiffin orders & menus</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <div className="relative">
            <UserIcon className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text" required
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="password" required
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg transition shadow-md flex justify-center items-center space-x-2"
        >
          {loading ? <span>Logging in...</span> : <><span>Login</span><LogIn className="w-4 h-4" /></>}
        </button>
      </form>
    </div>
  );
}

/* ================= 2. REGISTER COMPONENT ================= */
function Register({ setActiveTab }) {
  const [form, setForm] = useState({
    username: '', password: '', contactNumber: '', emailId: '', address: '', role: 'USER'
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = { ...form, role: 'USER' };
      await registerUser(payload);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => setActiveTab('login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different username/email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg border border-slate-100 p-8 mt-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
        <p className="text-sm text-slate-500">Join Vaibhav Mess for fresh tiffins every day</p>
      </div>

      {error && <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm">{error}</div>}
      {success && <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-3 text-green-700 text-sm">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              type="text" required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email ID</label>
            <input 
              type="email" required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={form.emailId} onChange={(e) => setForm({ ...form, emailId: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
            <input 
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address</label>
          <textarea 
            rows="2" required
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg transition shadow-md"
        >
          {loading ? 'Registering...' : 'Register Now'}
        </button>
      </form>
    </div>
  );
}

/* ================= 3. USER DASHBOARD (With 5-sec Approval Popup) ================= */
function UserDashboard({ user }) {
  const [notes, setNotes] = useState([]);
  const [menus, setMenus] = useState([]);
  const [tiffinForm, setTiffinForm] = useState({
    requestDate: new Date().toISOString().split('T')[0],
    quantity: 1,
    useCustomAddress: false,
    newAddress: ''
  });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [approvalPopup, setApprovalPopup] = useState('');

  useEffect(() => {
    fetchNotes();
    fetchMenus();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await getDailyMenu();
      setMenus(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTiffinSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    setApprovalPopup('');

    const targetAddress = tiffinForm.useCustomAddress && tiffinForm.newAddress ? tiffinForm.newAddress : user.address;

    try {
      await sendTiffinRequest(
        user.id, 
        tiffinForm.useCustomAddress ? tiffinForm.newAddress : null, 
        { requestDate: tiffinForm.requestDate, quantity: tiffinForm.quantity }
      );

      setMsg({ text: 'Tiffin request placed successfully! Waiting for approval...', type: 'success' });

      // Trigger popup message box exactly after 5 seconds
      setTimeout(() => {
        const approvalText = `Your tiffin request is approved! Your tiffin will be delivered in some time on given address: ${targetAddress}\n\nRegards,\nVaibhav Mess`;
        setApprovalPopup(approvalText);
      }, 5000);

    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to submit tiffin request', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* 5-Second Delayed Approval Popup Modal */}
      {approvalPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-green-500 text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Tiffin Approved! 🎉</h3>
            <div className="bg-slate-50 p-4 rounded-xl border text-slate-700 text-sm whitespace-pre-line text-left font-medium">
              {approvalPopup}
            </div>
            <button 
              onClick={() => setApprovalPopup('')}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl transition shadow"
            >
              OK, Got it!
            </button>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hello, {user.username}! 👋</h1>
          <p className="mt-1 opacity-90">Ready for a delicious homemade tiffin today?</p>
        </div>
        <div className="hidden md:block bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
          <p className="text-xs uppercase tracking-wider font-semibold">Registered Address</p>
          <p className="text-sm font-medium mt-1">{user.address || 'No address saved'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tiffin Request Form */}
        <div className="bg-white rounded-xl shadow-md border p-6 lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <UtensilsCrossed className="w-5 h-5 text-orange-600" />
            <span>Request a Tiffin</span>
          </h2>

          {msg.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleTiffinSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Request Date</label>
              <input 
                type="date" required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                value={tiffinForm.requestDate}
                onChange={(e) => setTiffinForm({ ...tiffinForm, requestDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
              <input 
                type="number" min="1" required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                value={tiffinForm.quantity}
                onChange={(e) => setTiffinForm({ ...tiffinForm, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input 
                type="checkbox" id="customAddr"
                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                checked={tiffinForm.useCustomAddress}
                onChange={(e) => setTiffinForm({ ...tiffinForm, useCustomAddress: e.target.checked })}
              />
              <label htmlFor="customAddr" className="text-sm font-medium text-slate-700 cursor-pointer">Deliver to a different address?</label>
            </div>

            {tiffinForm.useCustomAddress && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Delivery Address</label>
                <textarea 
                  rows="2" required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Enter complete alternate delivery address"
                  value={tiffinForm.newAddress}
                  onChange={(e) => setTiffinForm({ ...tiffinForm, newAddress: e.target.value })}
                />
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg transition shadow-md"
            >
              Place Tiffin Request
            </button>
          </form>
        </div>

        {/* Right Column: Daily Menu & Notices */}
        <div className="bg-white rounded-xl shadow-md border p-6 lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span>Today's Menu & Special Dishes</span>
            </h2>

            {menus.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 bg-slate-50 rounded-lg text-center border border-dashed">No menu published yet by the admin.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menus.map((menu) => (
                  <div key={menu.id} className="border border-orange-100 bg-orange-50/50 p-4 rounded-xl shadow-sm">
                    <div className="flex items-center space-x-2 text-orange-700 font-semibold text-xs mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{menu.menuDate ? new Date(menu.menuDate).toLocaleDateString() : 'Scheduled Menu'}</span>
                    </div>
                    <p className="text-slate-800 font-medium text-sm whitespace-pre-line">{menu.menuDescription}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-slate-100" />

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-orange-600" />
              <span>Notice Board & Announcements</span>
            </h2>

            {notes.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">No notices posted yet.</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="border border-slate-100 bg-slate-50 p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-800 text-sm">{note.title}</h3>
                      <span className="text-xs text-slate-400">
                        {note.postedAt ? new Date(note.postedAt).toLocaleString() : ''}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm whitespace-pre-line">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= 4. ADMIN DASHBOARD ================= */
function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [menuForm, setMenuForm] = useState({ menuDate: '', menuDescription: '' });
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });
  const [statusMsg, setStatusMsg] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getAllRequests();
      setRequests(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = menuForm.menuDate.includes('T') ? menuForm.menuDate : `${menuForm.menuDate}T00:00:00`;
      await addDailyMenu({ ...menuForm, menuDate: formattedDate });
      setStatusMsg('Daily menu added successfully!');
      setMenuForm({ menuDate: '', menuDescription: '' });
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add menu');
    }
  };

  const handlePostNote = async (e) => {
    e.preventDefault();
    try {
      await postNote(noteForm);
      setStatusMsg('Note posted successfully!');
      setNoteForm({ title: '', content: '' });
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post note');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchRequests();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      fetchRequests();
      alert('User updated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const usersMap = new Map();
  requests.forEach(r => {
    if (r.user) usersMap.set(r.user.id, r.user);
  });
  const uniqueUsers = Array.from(usersMap.values());

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <ShieldAlert className="w-8 h-8 text-orange-500" />
            <span>Admin Control Panel (Vaibhav Bakal)</span>
          </h1>
          <p className="mt-1 text-slate-400">Manage mess requests, users, daily menu, and announcements</p>
        </div>
        {statusMsg && (
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow">
            {statusMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md border p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span>Publish Daily Menu</span>
          </h2>
          <form onSubmit={handleAddMenu} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Menu Date & Time</label>
              <input 
                type="datetime-local" required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                value={menuForm.menuDate}
                onChange={(e) => setMenuForm({ ...menuForm, menuDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Menu Description</label>
              <textarea 
                rows="3" required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="e.g. Chapati, Paneer Masala, Dal Fry, Rice, Sweet"
                value={menuForm.menuDescription}
                onChange={(e) => setMenuForm({ ...menuForm, menuDescription: e.target.value })}
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition shadow">
              Add Menu
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-md border p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-orange-600" />
            <span>Post Notice / Note</span>
          </h2>
          <form onSubmit={handlePostNote} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notice Title</label>
              <input 
                type="text" required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="e.g. Holiday on Sunday"
                value={noteForm.title}
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Notice Content</label>
              <textarea 
                rows="3" required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Enter detailed notice content..."
                value={noteForm.content}
                onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition shadow">
              Post Notice
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span>All Tiffin Requests</span>
          </h2>
          <button onClick={fetchRequests} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-semibold text-slate-700 transition">
            Refresh Now
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                <th className="p-3 rounded-l-lg">ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Date</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Delivery Address</th>
                <th className="p-3 rounded-r-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-400">No tiffin requests found.</td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-semibold text-slate-600">#{req.id}</td>
                    <td className="p-3 font-medium text-slate-800">{req.user?.username || 'N/A'}</td>
                    <td className="p-3 text-slate-600">{req.requestDate}</td>
                    <td className="p-3 text-slate-600">{req.quantity}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{req.deliveryAddress}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${req.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <UserIcon className="w-5 h-5 text-orange-600" />
          <span>User Accounts Management</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                <th className="p-3 rounded-l-lg">ID</th>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Address</th>
                <th className="p-3 rounded-r-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {uniqueUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-400">No users found.</td>
                </tr>
              ) : (
                uniqueUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-semibold text-slate-600">#{u.id}</td>
                    <td className="p-3 font-medium text-slate-800">{u.username}</td>
                    <td className="p-3 text-slate-600">{u.emailId}</td>
                    <td className="p-3 text-slate-600">{u.contactNumber || 'N/A'}</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{u.address}</td>
                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => setEditingUser(u)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Edit User: {editingUser.username}</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input 
                  type="text" required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  value={editingUser.contactNumber || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, contactNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea 
                  rows="2" required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  value={editingUser.address || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold shadow transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}