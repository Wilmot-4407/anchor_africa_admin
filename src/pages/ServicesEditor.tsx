import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { fetchServices, deleteService } from "../redux/actions/services";
import { AppDispatch, RootState } from "../redux/store";
import { CardSkeletonLoader } from "../components/common/SkeletonLoader";
import { EmptyState, ErrorState } from "../components/common/StateComponents";
import { ServiceForm } from "../components/forms/ServiceForm";
import { Service } from "../redux/types";

export function ServicesEditor() {
  const dispatch = useDispatch<AppDispatch>();
  const { services, isLoading, error } = useSelector(
    (state: RootState) => state.services,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Derive unique types from services
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await dispatch(deleteService(id));
    }
  };

  const handleOpenForm = (service?: Service) => {
    setEditingService(service || null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-heading">Services</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {services.length} service{services.length !== 1 ? "s" : ""} · Manage
            your healthcare services
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          New Service
        </button>
      </div>

      {/* Controls */}
      {/* <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          />
        </div>
      </div> */}

      {/* Content */}
      {isLoading ? (
        <CardSkeletonLoader count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => dispatch(fetchServices())} />
      ) : filteredServices.length === 0 ? (
        <EmptyState
          title="No services found"
          description={
            searchTerm
              ? "Try adjusting your search or filter"
              : "Create your first service to get started"
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <motion.div
              key={service._id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all p-5 group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary capitalize border border-primary/20">
                  {service.type}
                </span>
                <span className="text-xs text-slate-400">
                  {service.category}
                </span>
              </div>

              <h3 className="font-semibold text-heading text-sm leading-snug mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                {service.shortDescription}
              </p>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenForm(service)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ServiceForm
          service={editingService}
          onClose={handleCloseForm}
          onSuccess={() => {
            dispatch(fetchServices());
            handleCloseForm();
          }}
        />
      )}
    </motion.div>
  );
}
