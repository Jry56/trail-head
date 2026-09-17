import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/ProductsList';
import ProductForm from './pages/ProductForm';
import CategoriesList from './pages/CategoriesList';
import OrdersList from './pages/OrdersList';
import OrderDetail from './pages/OrderDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductForm />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Route>
      </Route>
    </Routes>
  );
}
