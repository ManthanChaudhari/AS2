import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Loader2, X } from "lucide-react";
import ApiService from "@/lib/ApiServiceFunctions";
import ApiEndPoints from "@/lib/ApiServiceEndpoint";

export default function UserManagementDialog({ fetchUsers = () => {} }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
    role: "",
    permissions: [],
    usergroup: "",
    designation: "",
    expertise_areas: [],
    issendnotification: false,
    auth_type: "Standard",
    password: "",
    tenant_id: 0,
    reference_id: 0,
  });
  const [permissionInput, setPermissionInput] = useState("");
  const [expertiseInput, setExpertiseInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }));
  };

  const addPermission = () => {
    if (permissionInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        permissions: [...prev.permissions, permissionInput.trim()],
      }));
      setPermissionInput("");
    }
  };

  const removePermission = (index) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.filter((_, i) => i !== index),
    }));
  };

  const addExpertiseArea = () => {
    if (expertiseInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        expertise_areas: [
          ...prev.expertise_areas,
          { name: expertiseInput.trim() },
        ],
      }));
      setExpertiseInput("");
    }
  };

  const removeExpertiseArea = (index) => {
    setFormData((prev) => ({
      ...prev,
      expertise_areas: prev.expertise_areas.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await ApiService.post(
        `${ApiEndPoints.USER_MANAGEMENT.USER_ALL}`,
        formData
      );

      if (response.ok) {
        setOpen(false);
        fetchUsers();
        setFormData({
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          phone_number: "",
          role: "",
          permissions: [],
          usergroup: "",
          designation: "",
          expertise_areas: [],
          issendnotification: false,
          auth_type: "Standard",
          password: "",
          tenant_id: 0,
          reference_id: 0,
        });
      } else {
        const error = await response.json();
        alert("Error creating user: " + (error.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Error creating user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          Add User
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                User Group
              </label>
              <input
                type="text"
                name="usergroup"
                value={formData.usergroup}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Permissions
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={permissionInput}
                onChange={(e) => setPermissionInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addPermission())
                }
                placeholder="Add permission"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addPermission}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.permissions.map((perm, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {perm}
                  <button
                    type="button"
                    onClick={() => removePermission(index)}
                    className="hover:text-blue-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Expertise Areas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addExpertiseArea())
                }
                placeholder="Add expertise area"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addExpertiseArea}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.expertise_areas.map((area, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {area.name}
                  <button
                    type="button"
                    onClick={() => removeExpertiseArea(index)}
                    className="hover:text-green-900"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Auth Type
              </label>
              <select
                name="auth_type"
                value={formData.auth_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Standard">Standard</option>
                <option value="OAuth">OAuth</option>
                <option value="SSO">SSO</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Tenant ID
              </label>
              <input
                type="number"
                name="tenant_id"
                value={formData.tenant_id}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Reference ID
              </label>
              <input
                type="number"
                name="reference_id"
                value={formData.reference_id}
                onChange={handleNumberChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="issendnotification"
              name="issendnotification"
              checked={formData.issendnotification}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="issendnotification" className="text-sm font-medium">
              Send Notification
            </label>
          </div>

          <DialogFooter className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 flex items-center gap-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Create User
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
