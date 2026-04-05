import { motion } from "framer-motion";
import {
  Car,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Settings,
  BarChart3,
  FileText,
  Menu,
  Bell,
  Search,
} from "lucide-react";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useGetAllBookingsQuery } from "../../features/Bookings/bookingsApi";
import { useGetVehiclesQuery } from "../../features/Vehicles/vehiclesApi";
import { useGetUsersQuery } from "../../features/Users/usersApi";

export const AdminDashboard = () => {
  const { data: bookings, isLoading: bookingsLoading } = useGetAllBookingsQuery();
  const { data: vehicles, isLoading: vehiclesLoading } = useGetVehiclesQuery();
  const { data: users, isLoading: usersLoading } = useGetUsersQuery();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Calculate stats
  const totalRevenue = bookings?.reduce((sum, b) => sum + (b.amount || b.price || 0), 0) || 0;
  const activeRentals = bookings?.filter(b => b.status === 'active' || b.status === 'confirmed').length || 0;
  const totalCustomers = users?.length || 0;
  const availableVehicles = vehicles?.filter(v => v.status === 'available').length || 0;

  const recentBookings = bookings?.slice(0, 5) || [];
  const vehicleStatus = vehicles?.slice(0, 5) || [];

  const isLoading = bookingsLoading || vehiclesLoading || usersLoading;

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Active Rentals",
      value: activeRentals.toString(),
      change: "+5",
      icon: Car,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      change: "+18",
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Available Vehicles",
      value: availableVehicles.toString(),
      change: "-3",
      icon: Calendar,
      color: "from-orange-500 to-orange-600",
    },
  ];

  const quickActions = [
    {
      icon: Car,
      title: "Add Vehicle",
      description: "Register new vehicle",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Users,
      title: "Manage Users",
      description: "View customer list",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FileText,
      title: "Reports",
      description: "Generate reports",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Settings,
      title: "Settings",
      description: "System configuration",
      color: "from-slate-500 to-slate-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'rented':
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'maintenance':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
              >
                <Menu className="w-6 h-6 text-slate-600" />
              </button>
              <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-lg">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm text-slate-700 w-64"
                />
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3 p-2 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  AD
                </div>
                <div className="hidden md:block">
                  <p className="font-semibold text-slate-800 text-sm">Admin</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                        <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className={`bg-linear-to-br ${stat.color} p-3 rounded-xl`}>
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Charts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            >
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Revenue Overview</h3>
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                </div>
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                  <p className="text-slate-500">Chart placeholder - Revenue trend</p>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Booking Trends</h3>
                  <TrendingUp className="w-5 h-5 text-slate-600" />
                </div>
                <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                  <p className="text-slate-500">Chart placeholder - Booking analytics</p>
                </div>
              </Card>
            </motion.div>

            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Recent Bookings</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Customer</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Vehicle</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-sm text-slate-800">{booking.customer}</td>
                          <td className="py-3 px-4 text-sm text-slate-800">{booking.vehicle}</td>
                          <td className="py-3 px-4 text-sm text-slate-600">{booking.date}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-slate-800">${booking.amount}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>

            {/* Vehicle Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Fleet Status</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Manage Fleet
                  </button>
                </div>
                <div className="space-y-3">
                  {vehicleStatus.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{vehicle.name}</p>
                          <p className="text-sm text-slate-600">{vehicle.model} • {vehicle.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-slate-600">Revenue (MTD)</p>
                          <p className="font-semibold text-slate-800">${vehicle.revenue}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * (index + 8) }}
                    className="bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-xl transition-all text-left group hover:scale-105"
                  >
                    <div className={`bg-linear-to-br ${action.color} p-3 rounded-xl inline-block mb-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-slate-600 text-sm">{action.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};
