import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Edit3, Camera, Calendar, MapPin, Mail, Package, CreditCard, Check, X, User, Clock, DollarSign } from 'lucide-react';
import api from '@/api/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', profileImage: null });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setUser({ ...res.data, orderHistory: res.data.orderHistory || [] });
        setForm({ name: res.data.name || '', address: res.data.address || '', profileImage: null });
        setPreview(res.data.profileImageUrl || null);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setForm((prev) => ({ ...prev, profileImage: files[0] }));
      if (files[0]) {
        setPreview(URL.createObjectURL(files[0]));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = () => setEditMode(true);
  
  const handleCancel = () => {
    setEditMode(false);
    setForm({ name: user.name || '', address: user.address || '', profileImage: null });
    setPreview(user.profileImageUrl || null);
    setSuccess(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    setSuccess(null);
    setUploading(true);
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('address', form.address);
    if (form.profileImage) {
      formData.append('profileImage', form.profileImage);
    }
    
    try {
      const res = await api.put('/users/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser({ ...res.data, orderHistory: res.data.orderHistory || [] });
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 border-4 border-blue-300 border-t-transparent"></div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md shadow-xl border-red-200">
          <X className="h-5 w-5" />
          <AlertTitle className="text-lg">Oops! Something went wrong</AlertTitle>
          <AlertDescription className="text-base">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-xl">No profile found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">Manage your personal information and view your activity</p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-8 max-w-2xl mx-auto">
            <Alert className="border-green-200 bg-green-50 text-green-800 shadow-lg animate-in slide-in-from-top-4">
              <Check className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800 text-lg">Success!</AlertTitle>
              <AlertDescription className="text-green-700 text-base">{success}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto">
            <Alert variant="destructive" className="shadow-lg animate-in slide-in-from-top-4">
              <X className="h-5 w-5" />
              <AlertTitle className="text-lg">Error</AlertTitle>
              <AlertDescription className="text-base">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <User className="h-6 w-6" />
                  </div>
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {editMode ? (
                  <div className="space-y-8">
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative group">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-xl ring-4 ring-blue-100">
                          <AvatarImage src={preview} alt={form.name} className="object-cover" />
                          <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                            {form.name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <label htmlFor="profileImage" className="cursor-pointer">
                          <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                            <Camera className="h-5 w-5" />
                            <span className="font-medium">Change Photo</span>
                          </div>
                        </label>
                        <Input
                          id="profileImage"
                          type="file"
                          name="profileImage"
                          accept="image/*"
                          onChange={handleChange}
                          className="hidden"
                        />
                        <p className="text-sm text-gray-500">JPG, PNG or GIF (max 5MB)</p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          className="w-full h-12 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-2 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Address
                        </label>
                        <Input
                          type="text"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          placeholder="Enter your complete address"
                          className="w-full h-12 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-2 rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end pt-6 border-t-2 border-gray-100">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={uploading}
                        className="px-8 py-3 text-lg border-2 hover:bg-gray-50"
                      >
                        <X className="h-5 w-5 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSubmit}
                        disabled={uploading}
                        className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="h-5 w-5 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Profile Display */}
                    <div className="flex flex-col items-center gap-6 mb-10">
                      <Avatar className="w-32 h-32 border-4 border-white shadow-xl ring-4 ring-blue-100">
                        <AvatarImage src={user.profileImageUrl} alt={user.name} className="object-cover" />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h2>
                        <p className="text-gray-600 flex items-center justify-center gap-2 text-lg">
                          <Mail className="h-5 w-5" />
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-4 mb-10">
                      {user.address ? (
                        <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <MapPin className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Address</p>
                            <p className="text-gray-900 text-lg">{user.address}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <MapPin className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Address</p>
                            <p className="text-gray-500 text-lg mb-2">No address found.</p>
                            <Button onClick={handleEdit} className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                              Add Address
                            </Button>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Member Since</p>
                          <p className="text-gray-900 text-lg">{new Date(user.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</p>
                        </div>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <Button 
                      onClick={handleEdit} 
                      className="w-full py-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Edit3 className="h-5 w-5 mr-3" />
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order History Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Package className="h-6 w-6" />
                  </div>
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {user.orderHistory && user.orderHistory.length > 0 ? (
                  <div className="space-y-4">
                    {user.orderHistory.map((order, index) => (
                      <Card key={order._id} className="border-2 border-gray-100 hover:border-blue-200 transition-colors duration-200 bg-gradient-to-r from-gray-50 to-blue-50">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-600">Order #{index + 1}</span>
                              <div className="flex items-center gap-1 text-green-600">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-bold">{order.totalPrice}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                              <span className="text-xs text-gray-500 font-mono">ID: {order._id}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {/* Order Summary */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">Total Orders:</span>
                        <span className="text-xl font-bold text-indigo-600">{user.orderHistory.length}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No orders yet</p>
                    <p className="text-gray-400 text-sm mt-2">Your order history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats Card */}
            <Card className="mt-6 shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                    <span className="text-gray-600">Profile Complete</span>
                    <span className="font-bold text-xl text-blue-600">
                      {user.address ? '100%' : '80%'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <span className="text-gray-600">Account Status</span>
                    <span className="font-bold text-green-600">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;