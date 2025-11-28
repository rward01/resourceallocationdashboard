import React, { useState, useMemo } from 'react';
import { Calendar, Users, Briefcase, CheckSquare, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const RESOURCE_TYPES = [
     'FCI Programmer',
     'ABC Programmer',
     'GHI Programmer',
     'JKL Programmer',
     'MNO Programmer'
];

const MILESTONE_TYPES = [
     'Mapping Slice Due',
     'Mapping Sessions',
     '1st Cut Slice Due',
     '1st Cut Internal Delivery',
     '1st Cut Support',
     '2nd Cut Slice Due',
     '2nd Cut Internal Delivery',
     '2nd Cut Support',
     '3rd Cut Slice Due',
     '3rd Cut Internal Delivery',
     '3rd Cut Support',
     'Mock Slice Due',
     'Mock 1',
     'Mock 2',
     'Go-Live'
];

const REQUIRED_MILESTONES = [
     '1st Cut Slice Due',
     '1st Cut Internal Delivery',
     '1st Cut Support',
     'Mock Slice Due',
     'Mock 1',
     'Go-Live'
];

const generateResources = () => {
     const firstNames = ['Adam', 'Bob', 'Carol', 'Dick', 'Emma', 'Frank', 'Grace', 'Henry',
          'Iris', 'Jack', 'Kate', 'Leo', 'Mary', 'Nathan', 'Olivia', 'Paul', 'Quinn', 'Rachel',
          'Steve', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xavier', 'Yolanda', 'Zack', 'Alice',
          'Brian', 'Cathy', 'David', 'Elena', 'Fred', 'Gina', 'Harold', 'Irene', 'James',
          'Karen', 'Larry', 'Monica', 'Nancy', 'Oscar', 'Pam', 'Quincy', 'Rita', 'Sam',
          'Teresa', 'Ulysses', 'Vera', 'Walter', 'Xena'];

     const lastNames = ['Appl', 'Weave', 'Burnett', 'Clark', 'Stone', 'Rivers', 'Woods', 'Lake',
          'Hill', 'Dale', 'Brooks', 'Fields', 'Ford', 'Banks', 'Wells', 'Snow', 'Frost', 'Storm',
          'Cloud', 'Rain', 'Moon', 'Star', 'Sun', 'Sky', 'Ocean', 'Bay', 'Creek', 'Ridge',
          'Valley', 'Peak', 'Meadow', 'Grove', 'Park', 'Garden', 'Forest', 'Beach', 'Shore',
          'Coast', 'Island', 'Harbor', 'Port', 'Bridge', 'Road', 'Lane', 'Path', 'Trail',
          'Route', 'Avenue', 'Street', 'Court'];

     return Array.from({ length: 50 }, (_, i) => {
          const numTypes = Math.random() > 0.85 ? 2 : 1;
          const types = [];
          const availableTypes = [...RESOURCE_TYPES];

          for (let j = 0; j < numTypes; j++) {
               const typeIndex = Math.floor(Math.random() * availableTypes.length);
               types.push(availableTypes[typeIndex]);
               availableTypes.splice(typeIndex, 1);
          }

          return {
               id: `resource-${i + 1}`,
               name: `${firstNames[i]} ${lastNames[i]}`,
               types: types
          };
     });
};

const generateClients = () => {
     const creditUnions = ['First Federal', 'Community Trust', 'United Members', 'Pacific Coast',
          'Mountain View', 'Riverside', 'Golden State', 'Liberty', 'Horizon'];

     const banks = ['National Bank', 'Commerce Bank', 'Farmers Bank', 'Merchants Bank',
          'Citizens Bank', 'Founders Bank', 'Heritage Bank', 'Summit Bank', 'Pioneer Bank'];

     const clients = [];

     creditUnions.forEach((name, i) => {
          clients.push({
               id: `client-cu-${i + 1}`,
               name: `${name} Credit Union`,
               type: Math.random() > 0.5 ? 'Merger' : 'NewBus',
               year: 2025 + Math.floor(i / 3)
          });
     });

     banks.forEach((name, i) => {
          clients.push({
               id: `client-bank-${i + 1}`,
               name: name,
               type: Math.random() > 0.5 ? 'Merger' : 'NewBus',
               year: 2025 + Math.floor(i / 3)
          });
     });

     return clients;
};

const generateProjectMilestones = (clients) => {
     const milestones = [];

     clients.forEach(client => {
          const has2ndCut = Math.random() > 0.5;
          const has3rdCut = has2ndCut && Math.random() > 0.7;
          const hasMock2 = Math.random() > 0.6;
          const hasMappingSessions = Math.random() > 0.5;

          let projectMilestones = [
               ...(hasMappingSessions ? ['Mapping Slice Due', 'Mapping Sessions'] : ['Mapping Slice Due']),
               '1st Cut Slice Due',
               '1st Cut Internal Delivery',
               '1st Cut Support'
          ];

          if (has2ndCut) {
               projectMilestones.push('2nd Cut Slice Due', '2nd Cut Internal Delivery', '2nd Cut Support');
          }

          if (has3rdCut) {
               projectMilestones.push('3rd Cut Slice Due', '3rd Cut Internal Delivery', '3rd Cut Support');
          }

          projectMilestones.push('Mock Slice Due', 'Mock 1');

          if (hasMock2) {
               projectMilestones.push('Mock 2');
          }

          projectMilestones.push('Go-Live');

          const yearStart = new Date(client.year, 0, 1);
          const yearEnd = new Date(client.year, 11, 31);
          const startDate = new Date(yearStart.getTime() + Math.random() * (yearEnd.getTime() - yearStart.getTime()));

          let currentDate = new Date(startDate);

          projectMilestones.forEach((milestoneName, index) => {
               const duration = 7 + Math.floor(Math.random() * 8);
               const endDate = new Date(currentDate);
               endDate.setDate(endDate.getDate() + duration);

               milestones.push({
                    id: `milestone-${client.id}-${index}`,
                    clientId: client.id,
                    clientName: client.name,
                    name: milestoneName,
                    startDate: new Date(currentDate),
                    endDate: new Date(endDate),
                    duration: duration
               });

               currentDate = new Date(endDate);
               const gap = 21 + Math.floor(Math.random() * 15);
               currentDate.setDate(currentDate.getDate() + gap);
          });
     });

     return milestones;
};

const generateResourceAllocations = (resources, milestones) => {
     const allocations = [];

     const milestonesByClient = {};
     milestones.forEach(milestone => {
          if (!milestonesByClient[milestone.clientId]) {
               milestonesByClient[milestone.clientId] = [];
          }
          milestonesByClient[milestone.clientId].push(milestone);
     });

     Object.keys(milestonesByClient).forEach(clientId => {
          const clientMilestones = milestonesByClient[clientId];
          const clientResourceAssignments = {};

          RESOURCE_TYPES.forEach(resourceType => {
               const resourcesWithType = resources.filter(r => r.types.includes(resourceType));

               if (resourcesWithType.length > 0) {
                    const assignedResource = resourcesWithType[Math.floor(Math.random() * resourcesWithType.length)];
                    clientResourceAssignments[resourceType] = assignedResource;
               }
          });

          clientMilestones.forEach(milestone => {
               Object.values(clientResourceAssignments).forEach(resource => {
                    allocations.push({
                         id: `allocation-${milestone.id}-${resource.id}`,
                         resourceId: resource.id,
                         resourceName: resource.name,
                         resourceTypes: resource.types,
                         milestoneId: milestone.id,
                         milestoneName: milestone.name,
                         clientId: milestone.clientId,
                         clientName: milestone.clientName,
                         startDate: milestone.startDate,
                         endDate: milestone.endDate
                    });
               });
          });
     });

     return allocations;
};

const ResourceAllocationDashboard = () => {
     const [currentView, setCurrentView] = useState('dashboard');

     const resources = useMemo(() => {
          const saved = localStorage.getItem('resources');
          if (saved) {
               return JSON.parse(saved);
          }
          return generateResources();
     }, []);

     const clients = useMemo(() => {
          const saved = localStorage.getItem('clients');
          if (saved) {
               return JSON.parse(saved);
          }
          return generateClients();
     }, []);

     const milestones = useMemo(() => {
          const saved = localStorage.getItem('milestones');
          if (saved) {
               const parsed = JSON.parse(saved);
               return parsed.map(m => ({
                    ...m,
                    startDate: new Date(m.startDate),
                    endDate: new Date(m.endDate)
               }));
          }
          return generateProjectMilestones(clients);
     }, [clients]);

     const allocations = useMemo(() => {
          const saved = localStorage.getItem('allocations');
          if (saved) {
               const parsed = JSON.parse(saved);
               return parsed.map(a => ({
                    ...a,
                    startDate: new Date(a.startDate),
                    endDate: new Date(a.endDate)
               }));
          }
          return generateResourceAllocations(resources, milestones);
     }, [resources, milestones]);

     const [selectedClient, setSelectedClient] = useState('all');
     const [selectedResourceType, setSelectedResourceType] = useState('all');
     const [selectedResource, setSelectedResource] = useState('all');
     const [selectedMilestone, setSelectedMilestone] = useState('all');
     const [selectedYear, setSelectedYear] = useState(2025);
     const [filtersExpanded, setFiltersExpanded] = useState(true);

     const filteredAllocations = useMemo(() => {
          return allocations.filter(allocation => {
               if (selectedClient !== 'all' && allocation.clientId !== selectedClient) {
                    return false;
               }

               if (selectedResourceType !== 'all') {
                    const resource = resources.find(r => r.id === allocation.resourceId);
                    if (!resource || !resource.types.includes(selectedResourceType)) {
                         return false;
                    }
               }

               if (selectedResource !== 'all' && allocation.resourceId !== selectedResource) {
                    return false;
               }

               if (selectedMilestone !== 'all' && allocation.milestoneName !== selectedMilestone) {
                    return false;
               }

               if (allocation.startDate.getFullYear() !== selectedYear &&
                    allocation.endDate.getFullYear() !== selectedYear) {
                    return false;
               }

               return true;
          });
     }, [allocations, selectedClient, selectedResourceType, selectedResource, selectedMilestone, selectedYear, resources]);

     const availableClients = useMemo(() => {
          const clientIds = new Set(filteredAllocations.map(a => a.clientId));
          return clients.filter(c => clientIds.has(c.id));
     }, [filteredAllocations, clients]);

     const availableResourceTypes = useMemo(() => {
          const types = new Set();
          filteredAllocations.forEach(allocation => {
               const resource = resources.find(r => r.id === allocation.resourceId);
               if (resource) {
                    resource.types.forEach(type => types.add(type));
               }
          });
          return Array.from(types).sort();
     }, [filteredAllocations, resources]);

     const availableResources = useMemo(() => {
          const resourceIds = new Set(filteredAllocations.map(a => a.resourceId));
          return resources.filter(r => resourceIds.has(r.id));
     }, [filteredAllocations, resources]);

     const availableMilestones = useMemo(() => {
          const milestoneNames = new Set(filteredAllocations.map(a => a.milestoneName));
          return MILESTONE_TYPES.filter(m => milestoneNames.has(m));
     }, [filteredAllocations]);

     const groupedAllocations = useMemo(() => {
          const grouped = {};

          filteredAllocations.forEach(allocation => {
               const resource = resources.find(r => r.id === allocation.resourceId);
               if (!resource) return;

               resource.types.forEach(type => {
                    if (!grouped[type]) {
                         grouped[type] = {};
                    }

                    if (!grouped[type][resource.id]) {
                         grouped[type][resource.id] = {
                              resourceName: resource.name,
                              allocations: []
                         };
                    }

                    grouped[type][resource.id].allocations.push(allocation);
               });
          });

          return grouped;
     }, [filteredAllocations, resources]);

     const handleClientChange = (e) => {
          setSelectedClient(e.target.value);
     };

     const handleResourceTypeChange = (e) => {
          setSelectedResourceType(e.target.value);
     };

     const handleResourceChange = (e) => {
          setSelectedResource(e.target.value);
     };

     const handleMilestoneChange = (e) => {
          setSelectedMilestone(e.target.value);
     };

     const handleYearChange = (e) => {
          setSelectedYear(parseInt(e.target.value));
     };

     const toggleFilters = () => {
          setFiltersExpanded(!filtersExpanded);
     };

     const saveDataToLocalStorage = () => {
          localStorage.setItem('resources', JSON.stringify(resources));
          localStorage.setItem('clients', JSON.stringify(clients));
          localStorage.setItem('milestones', JSON.stringify(milestones));
          localStorage.setItem('allocations', JSON.stringify(allocations));
          alert('Data saved to browser storage!');
     };

     const clearDataFromLocalStorage = () => {
          if (window.confirm('Are you sure you want to clear all saved data and generate new random data? This cannot be undone.')) {
               localStorage.removeItem('resources');
               localStorage.removeItem('clients');
               localStorage.removeItem('milestones');
               localStorage.removeItem('allocations');
               window.location.reload();
          }
     };

     const exportDataAsJSON = () => {
          const data = {
               resources,
               clients,
               milestones,
               allocations,
               exportDate: new Date().toISOString()
          };
          const dataStr = JSON.stringify(data, null, 2);
          const dataBlob = new Blob([dataStr], { type: 'application/json' });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `resource-allocation-data-${new Date().toISOString().split('T')[0]}.json`;
          link.click();
     };

     const isDataSaved = () => {
          return localStorage.getItem('resources') &&
               localStorage.getItem('clients') &&
               localStorage.getItem('milestones') &&
               localStorage.getItem('allocations');
     };

     return (
          <div className="app-container">
               <nav className="main-nav">
                    <div className="nav-brand">Resource Allocation System</div>
                    <div className="nav-buttons">
                         <button
                              className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
                              onClick={() => setCurrentView('dashboard')}
                         >
                              📊 Dashboard
                         </button>
                         <button
                              className={`nav-btn ${currentView === 'management' ? 'active' : ''}`}
                              onClick={() => setCurrentView('management')}
                         >
                              ⚙️ Management
                         </button>
                    </div>
               </nav>

               {currentView === 'dashboard' ? (
                    <DashboardView
                         clients={clients}
                         resources={resources}
                         milestones={milestones}
                         allocations={allocations}
                         availableClients={availableClients}
                         availableResourceTypes={availableResourceTypes}
                         availableResources={availableResources}
                         availableMilestones={availableMilestones}
                         groupedAllocations={groupedAllocations}
                         selectedClient={selectedClient}
                         selectedResourceType={selectedResourceType}
                         selectedResource={selectedResource}
                         selectedMilestone={selectedMilestone}
                         selectedYear={selectedYear}
                         filtersExpanded={filtersExpanded}
                         handleClientChange={handleClientChange}
                         handleResourceTypeChange={handleResourceTypeChange}
                         handleResourceChange={handleResourceChange}
                         handleMilestoneChange={handleMilestoneChange}
                         handleYearChange={handleYearChange}
                         toggleFilters={toggleFilters}
                         saveDataToLocalStorage={saveDataToLocalStorage}
                         clearDataFromLocalStorage={clearDataFromLocalStorage}
                         exportDataAsJSON={exportDataAsJSON}
                         isDataSaved={isDataSaved}
                    />
               ) : (
                    <ManagementView />
               )}
          </div>
     );
};

const DashboardView = ({
     availableClients,
     availableResourceTypes,
     availableResources,
     availableMilestones,
     groupedAllocations,
     selectedClient,
     selectedResourceType,
     selectedResource,
     selectedMilestone,
     selectedYear,
     filtersExpanded,
     handleClientChange,
     handleResourceTypeChange,
     handleResourceChange,
     handleMilestoneChange,
     handleYearChange,
     toggleFilters,
     saveDataToLocalStorage,
     clearDataFromLocalStorage,
     exportDataAsJSON,
     isDataSaved
}) => {
     return (
          <div className="dashboard">
               <header className="dashboard-header">
                    <div className="header-content">
                         <h1>Resource Allocation Dashboard</h1>
                         <div className="data-controls">
                              <button className="data-button save" onClick={saveDataToLocalStorage} title="Save current data to browser storage">
                                   💾 Save Data
                              </button>
                              <button className="data-button export" onClick={exportDataAsJSON} title="Download data as JSON file">
                                   📥 Export JSON
                              </button>
                              <button className="data-button clear" onClick={clearDataFromLocalStorage} title="Clear saved data and generate new random data">
                                   🗑️ Clear & Regenerate
                              </button>
                              {isDataSaved() && <span className="data-status">✓ Data loaded from storage</span>}
                         </div>
                    </div>
               </header>

               <div className="filters-wrapper">
                    <button className="filters-toggle" onClick={toggleFilters}>
                         {filtersExpanded ? '▼' : '▶'} Filters
                    </button>
                    {filtersExpanded && (
                         <div className="filters-container">
                              <div className="filter-group">
                                   <label>
                                        <Briefcase size={16} />
                                        <span>Client</span>
                                   </label>
                                   <select value={selectedClient} onChange={handleClientChange}>
                                        <option value="all">All Clients</option>
                                        {availableClients.map(client => (
                                             <option key={client.id} value={client.id}>
                                                  {client.name} ({client.type})
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div className="filter-group">
                                   <label>
                                        <Users size={16} />
                                        <span>Resource Type</span>
                                   </label>
                                   <select value={selectedResourceType} onChange={handleResourceTypeChange}>
                                        <option value="all">All Resource Types</option>
                                        {availableResourceTypes.map(type => (
                                             <option key={type} value={type}>{type}</option>
                                        ))}
                                   </select>
                              </div>

                              <div className="filter-group">
                                   <label>
                                        <Users size={16} />
                                        <span>Resource</span>
                                   </label>
                                   <select value={selectedResource} onChange={handleResourceChange}>
                                        <option value="all">All Resources</option>
                                        {availableResources.map(resource => (
                                             <option key={resource.id} value={resource.id}>
                                                  {resource.name}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div className="filter-group">
                                   <label>
                                        <CheckSquare size={16} />
                                        <span>Milestone</span>
                                   </label>
                                   <select value={selectedMilestone} onChange={handleMilestoneChange}>
                                        <option value="all">All Milestones</option>
                                        {availableMilestones.map(milestone => (
                                             <option key={milestone} value={milestone}>{milestone}</option>
                                        ))}
                                   </select>
                              </div>

                              <div className="filter-group">
                                   <label>
                                        <Calendar size={16} />
                                        <span>Year</span>
                                   </label>
                                   <select value={selectedYear} onChange={handleYearChange}>
                                        <option value={2025}>2025</option>
                                        <option value={2026}>2026</option>
                                        <option value={2027}>2027</option>
                                        <option value={2028}>2028</option>
                                   </select>
                              </div>
                         </div>
                    )}
               </div>

               <div className="timeline-container">
                    <TimelineView
                         groupedAllocations={groupedAllocations}
                         selectedYear={selectedYear}
                    />
               </div>
          </div>
     );
};

const ManagementView = () => {
     const [activeTab, setActiveTab] = useState('clients');
     const [clients, setClients] = useState([]);
     const [resources, setResources] = useState([]);
     const [milestones, setMilestones] = useState([]);
     const [allocations, setAllocations] = useState([]);

     const [editingClient, setEditingClient] = useState(null);
     const [editingResource, setEditingResource] = useState(null);

     React.useEffect(() => {
          const loadedClients = localStorage.getItem('clients');
          const loadedResources = localStorage.getItem('resources');
          const loadedMilestones = localStorage.getItem('milestones');
          const loadedAllocations = localStorage.getItem('allocations');

          if (loadedClients) setClients(JSON.parse(loadedClients));
          if (loadedResources) setResources(JSON.parse(loadedResources));
          if (loadedMilestones) {
               const parsed = JSON.parse(loadedMilestones);
               setMilestones(parsed.map(m => ({
                    ...m,
                    startDate: new Date(m.startDate),
                    endDate: new Date(m.endDate)
               })));
          }
          if (loadedAllocations) {
               const parsed = JSON.parse(loadedAllocations);
               setAllocations(parsed.map(a => ({
                    ...a,
                    startDate: new Date(a.startDate),
                    endDate: new Date(a.endDate)
               })));
          }
     }, []);

     const saveAllData = () => {
          localStorage.setItem('clients', JSON.stringify(clients));
          localStorage.setItem('resources', JSON.stringify(resources));
          localStorage.setItem('milestones', JSON.stringify(milestones));
          localStorage.setItem('allocations', JSON.stringify(allocations));
          alert('All changes saved! Switch to Dashboard to see updates.');
          window.location.reload();
     };

     const addNewClient = () => {
          const newClient = {
               id: `client-new-${Date.now()}`,
               name: '',
               type: 'Merger',
               year: 2025
          };
          setClients([...clients, newClient]);
          setEditingClient(newClient.id);
     };

     const updateClient = (id, field, value) => {
          setClients(clients.map(c =>
               c.id === id ? { ...c, [field]: value } : c
          ));
     };

     const deleteClient = (id) => {
          if (window.confirm('Delete this client and all associated milestones?')) {
               setClients(clients.filter(c => c.id !== id));
               setMilestones(milestones.filter(m => m.clientId !== id));
               setAllocations(allocations.filter(a => a.clientId !== id));
          }
     };

     const addNewResource = () => {
          const newResource = {
               id: `resource-new-${Date.now()}`,
               name: '',
               types: []
          };
          setResources([...resources, newResource]);
          setEditingResource(newResource.id);
     };

     const updateResource = (id, field, value) => {
          setResources(resources.map(r =>
               r.id === id ? { ...r, [field]: value } : r
          ));
     };

     const toggleResourceType = (resourceId, type) => {
          setResources(resources.map(r => {
               if (r.id === resourceId) {
                    const hasType = r.types.includes(type);
                    return {
                         ...r,
                         types: hasType
                              ? r.types.filter(t => t !== type)
                              : [...r.types, type]
                    };
               }
               return r;
          }));
     };

     const deleteResource = (id) => {
          if (window.confirm('Delete this resource?')) {
               setResources(resources.filter(r => r.id !== id));
               setAllocations(allocations.filter(a => a.resourceId !== id));
          }
     };

     const addMilestoneToClient = (clientId) => {
          const client = clients.find(c => c.id === clientId);
          if (!client) return;

          const newMilestone = {
               id: `milestone-${clientId}-${Date.now()}`,
               clientId: clientId,
               clientName: client.name,
               name: 'Mapping Slice Due',
               startDate: new Date(),
               endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
               duration: 7
          };
          setMilestones([...milestones, newMilestone]);
     };

     const updateMilestone = (id, field, value) => {
          setMilestones(milestones.map(m =>
               m.id === id ? { ...m, [field]: value } : m
          ));
     };

     const deleteMilestone = (id) => {
          if (window.confirm('Delete this milestone?')) {
               setMilestones(milestones.filter(m => m.id !== id));
               setAllocations(allocations.filter(a => a.milestoneId !== id));
          }
     };

     const getClientAssignments = (clientId) => {
          const clientMilestones = milestones.filter(m => m.clientId === clientId);
          if (clientMilestones.length === 0) return {};

          const assignments = {};
          RESOURCE_TYPES.forEach(type => {
               const allocation = allocations.find(a =>
                    a.clientId === clientId &&
                    resources.find(r => r.id === a.resourceId && r.types.includes(type))
               );
               assignments[type] = allocation ? allocation.resourceId : null;
          });
          return assignments;
     };

     const assignResourceToClient = (clientId, resourceType, resourceId) => {
          const clientMilestones = milestones.filter(m => m.clientId === clientId);
          const client = clients.find(c => c.id === clientId);
          const resource = resources.find(r => r.id === resourceId);

          if (!client || !resource) return;

          const newAllocations = allocations.filter(a => {
               if (a.clientId !== clientId) return true;
               const oldResource = resources.find(r => r.id === a.resourceId);
               return !oldResource || !oldResource.types.includes(resourceType);
          });

          clientMilestones.forEach(milestone => {
               newAllocations.push({
                    id: `allocation-${milestone.id}-${resourceId}`,
                    resourceId: resource.id,
                    resourceName: resource.name,
                    resourceTypes: resource.types,
                    milestoneId: milestone.id,
                    milestoneName: milestone.name,
                    clientId: client.id,
                    clientName: client.name,
                    startDate: milestone.startDate,
                    endDate: milestone.endDate
               });
          });

          setAllocations(newAllocations);
     };

     return (
          <div className="management-container">
               <div className="management-header">
                    <h1>Resource Management</h1>
                    <button className="save-all-btn" onClick={saveAllData}>
                         <Save size={18} /> Save All Changes
                    </button>
               </div>

               <div className="tabs">
                    <button
                         className={`tab ${activeTab === 'clients' ? 'active' : ''}`}
                         onClick={() => setActiveTab('clients')}
                    >
                         Clients & Projects
                    </button>
                    <button
                         className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
                         onClick={() => setActiveTab('resources')}
                    >
                         Resources
                    </button>
                    <button
                         className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
                         onClick={() => setActiveTab('assignments')}
                    >
                         Assignments
                    </button>
               </div>

               <div className="tab-content">
                    {activeTab === 'clients' && (
                         <div className="clients-panel">
                              <div className="panel-header">
                                   <h2>Clients & Projects</h2>
                                   <button className="add-btn" onClick={addNewClient}>
                                        <Plus size={18} /> Add Client
                                   </button>
                              </div>

                              <div className="items-list">
                                   {clients.map(client => (
                                        <div key={client.id} className="item-card">
                                             {editingClient === client.id ? (
                                                  <div className="edit-form">
                                                       <input
                                                            type="text"
                                                            placeholder="Client Name"
                                                            value={client.name}
                                                            onChange={(e) => updateClient(client.id, 'name', e.target.value)}
                                                            className="edit-input"
                                                       />
                                                       <select
                                                            value={client.type}
                                                            onChange={(e) => updateClient(client.id, 'type', e.target.value)}
                                                            className="edit-select"
                                                       >
                                                            <option value="Merger">Merger</option>
                                                            <option value="NewBus">NewBus</option>
                                                       </select>
                                                       <select
                                                            value={client.year}
                                                            onChange={(e) => updateClient(client.id, 'year', parseInt(e.target.value))}
                                                            className="edit-select"
                                                       >
                                                            <option value={2025}>2025</option>
                                                            <option value={2026}>2026</option>
                                                            <option value={2027}>2027</option>
                                                            <option value={2028}>2028</option>
                                                       </select>
                                                       <button className="icon-btn save" onClick={() => setEditingClient(null)}>
                                                            <Save size={16} />
                                                       </button>
                                                  </div>
                                             ) : (
                                                  <div className="item-info">
                                                       <div className="item-details">
                                                            <h3>{client.name || '(Unnamed Client)'}</h3>
                                                            <p>{client.type} • {client.year}</p>
                                                            <p className="milestone-count">
                                                                 {milestones.filter(m => m.clientId === client.id).length} milestones
                                                            </p>
                                                       </div>
                                                       <div className="item-actions">
                                                            <button className="icon-btn" onClick={() => setEditingClient(client.id)}>
                                                                 <Edit2 size={16} />
                                                            </button>
                                                            <button className="icon-btn" onClick={() => addMilestoneToClient(client.id)}>
                                                                 <Plus size={16} /> Milestone
                                                            </button>
                                                            <button className="icon-btn delete" onClick={() => deleteClient(client.id)}>
                                                                 <Trash2 size={16} />
                                                            </button>
                                                       </div>
                                                  </div>
                                             )}

                                             {milestones.filter(m => m.clientId === client.id).length > 0 && (
                                                  <div className="milestones-list">
                                                       {milestones.filter(m => m.clientId === client.id).map(milestone => (
                                                            <div key={milestone.id} className="milestone-item">
                                                                 <select
                                                                      value={milestone.name}
                                                                      onChange={(e) => updateMilestone(milestone.id, 'name', e.target.value)}
                                                                      className="milestone-select"
                                                                 >
                                                                      {MILESTONE_TYPES.map(type => (
                                                                           <option key={type} value={type}>{type}</option>
                                                                      ))}
                                                                 </select>
                                                                 <input
                                                                      type="date"
                                                                      value={milestone.startDate.toISOString().split('T')[0]}
                                                                      onChange={(e) => updateMilestone(milestone.id, 'startDate', new Date(e.target.value))}
                                                                      className="date-input"
                                                                 />
                                                                 <input
                                                                      type="date"
                                                                      value={milestone.endDate.toISOString().split('T')[0]}
                                                                      onChange={(e) => updateMilestone(milestone.id, 'endDate', new Date(e.target.value))}
                                                                      className="date-input"
                                                                 />
                                                                 <button className="icon-btn delete small" onClick={() => deleteMilestone(milestone.id)}>
                                                                      <Trash2 size={14} />
                                                                 </button>
                                                            </div>
                                                       ))}
                                                  </div>
                                             )}

                                             {/* Resource assignments for this client */}
                                             <div className="client-assignments">
                                                  <h4>Resource Assignments</h4>
                                                  <div className="assignment-grid-inline">
                                                       {RESOURCE_TYPES.map(type => {
                                                            const availableResources = resources.filter(r => r.types.includes(type));
                                                            const assignments = getClientAssignments(client.id);
                                                            return (
                                                                 <div key={type} className="assignment-row-inline">
                                                                      <label>{type}:</label>
                                                                      <select
                                                                           value={assignments[type] || ''}
                                                                           onChange={(e) => assignResourceToClient(client.id, type, e.target.value)}
                                                                           className="assignment-select-inline"
                                                                      >
                                                                           <option value="">-- Select --</option>
                                                                           {availableResources.map(r => (
                                                                                <option key={r.id} value={r.id}>{r.name}</option>
                                                                           ))}
                                                                      </select>
                                                                 </div>
                                                            );
                                                       })}
                                                  </div>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    )}

                    {activeTab === 'resources' && (
                         <div className="resources-panel">
                              <div className="panel-header">
                                   <h2>Resources</h2>
                                   <button className="add-btn" onClick={addNewResource}>
                                        <Plus size={18} /> Add Resource
                                   </button>
                              </div>

                              <div className="items-list">
                                   {resources.map(resource => (
                                        <div key={resource.id} className="item-card">
                                             {editingResource === resource.id ? (
                                                  <div className="edit-form">
                                                       <input
                                                            type="text"
                                                            placeholder="Resource Name"
                                                            value={resource.name}
                                                            onChange={(e) => updateResource(resource.id, 'name', e.target.value)}
                                                            className="edit-input"
                                                       />
                                                       <div className="type-checkboxes">
                                                            {RESOURCE_TYPES.map(type => (
                                                                 <label key={type} className="checkbox-label">
                                                                      <input
                                                                           type="checkbox"
                                                                           checked={resource.types.includes(type)}
                                                                           onChange={() => toggleResourceType(resource.id, type)}
                                                                      />
                                                                      {type}
                                                                 </label>
                                                            ))}
                                                       </div>
                                                       <button className="icon-btn save" onClick={() => setEditingResource(null)}>
                                                            <Save size={16} />
                                                       </button>
                                                  </div>
                                             ) : (
                                                  <div className="item-info">
                                                       <div className="item-details">
                                                            <h3>{resource.name || '(Unnamed Resource)'}</h3>
                                                            <div className="type-badges">
                                                                 {resource.types.length > 0 ? (
                                                                      resource.types.map(type => (
                                                                           <span key={type} className="badge">{type}</span>
                                                                      ))
                                                                 ) : (
                                                                      <span className="badge empty">No types assigned</span>
                                                                 )}
                                                            </div>
                                                       </div>
                                                       <div className="item-actions">
                                                            <button className="icon-btn" onClick={() => setEditingResource(resource.id)}>
                                                                 <Edit2 size={16} />
                                                            </button>
                                                            <button className="icon-btn delete" onClick={() => deleteResource(resource.id)}>
                                                                 <Trash2 size={16} />
                                                            </button>
                                                       </div>
                                                  </div>
                                             )}
                                        </div>
                                   ))}
                              </div>
                         </div>
                    )}

                    {activeTab === 'assignments' && (
                         <div className="assignments-panel">
                              <div className="panel-header">
                                   <h2>Resource Assignments</h2>
                                   <p className="help-text">Assign one resource per type to each client project</p>
                              </div>

                              <div className="items-list">
                                   {clients.map(client => {
                                        const assignments = getClientAssignments(client.id);
                                        return (
                                             <div key={client.id} className="assignment-card">
                                                  <h3>{client.name}</h3>
                                                  <div className="assignment-grid">
                                                       {RESOURCE_TYPES.map(type => {
                                                            const availableResources = resources.filter(r => r.types.includes(type));
                                                            return (
                                                                 <div key={type} className="assignment-row">
                                                                      <label>{type}:</label>
                                                                      <select
                                                                           value={assignments[type] || ''}
                                                                           onChange={(e) => assignResourceToClient(client.id, type, e.target.value)}
                                                                           className="assignment-select"
                                                                      >
                                                                           <option value="">-- Select Resource --</option>
                                                                           {availableResources.map(r => (
                                                                                <option key={r.id} value={r.id}>{r.name}</option>
                                                                           ))}
                                                                      </select>
                                                                 </div>
                                                            );
                                                       })}
                                                  </div>
                                             </div>
                                        );
                                   })}
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
};

const TimelineView = ({ groupedAllocations, selectedYear }) => {
     const yearDays = useMemo(() => {
          const days = [];
          const startDate = new Date(selectedYear, 0, 1);

          for (let i = 0; i < 365; i++) {
               const date = new Date(startDate);
               date.setDate(date.getDate() + i);
               days.push(date);
          }

          return days;
     }, [selectedYear]);

     // Calculate which lane each milestone should be in to avoid overlaps
     const calculateLanes = (allocations) => {
          if (allocations.length === 0) return { lanes: [], maxLanes: 1 };

          // Sort by start date
          const sorted = [...allocations].sort((a, b) => a.startDate - b.startDate);

          // Assign each milestone to a lane
          const lanes = [];
          const laneAssignments = new Map();

          sorted.forEach(allocation => {
               // Find the first available lane where this milestone doesn't overlap
               let assignedLane = 0;
               let placed = false;

               while (!placed) {
                    // Check if this lane is free for this time period
                    const overlaps = Array.from(laneAssignments.entries()).some(([otherAlloc, lane]) => {
                         if (lane !== assignedLane) return false;

                         // Check if time periods overlap
                         const otherStart = otherAlloc.startDate.getTime();
                         const otherEnd = otherAlloc.endDate.getTime();
                         const thisStart = allocation.startDate.getTime();
                         const thisEnd = allocation.endDate.getTime();

                         return (thisStart < otherEnd && thisEnd > otherStart);
                    });

                    if (!overlaps) {
                         laneAssignments.set(allocation, assignedLane);
                         placed = true;
                    } else {
                         assignedLane++;
                    }
               }
          });

          // Calculate max lanes needed
          const maxLanes = Math.max(...Array.from(laneAssignments.values())) + 1;

          // Group allocations by lane
          for (let i = 0; i < maxLanes; i++) {
               lanes[i] = [];
          }

          laneAssignments.forEach((lane, allocation) => {
               lanes[lane].push(allocation);
          });

          return { lanes, maxLanes };
     };

     const getMilestonePosition = (allocation) => {
          const yearStart = new Date(selectedYear, 0, 1);
          const startDay = Math.floor((allocation.startDate - yearStart) / (1000 * 60 * 60 * 24));
          const endDay = Math.floor((allocation.endDate - yearStart) / (1000 * 60 * 60 * 24));

          if (endDay < 0 || startDay >= 365) return null;

          const clippedStart = Math.max(0, startDay);
          const clippedEnd = Math.min(364, endDay);
          const width = clippedEnd - clippedStart + 1;

          return {
               left: `${(clippedStart / 365) * 100}%`,
               width: `${(width / 365) * 100}%`
          };
     };

     const clientColors = useMemo(() => {
          const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
          const colorMap = {};
          let colorIndex = 0;

          Object.values(groupedAllocations).forEach(resourceTypeGroup => {
               Object.values(resourceTypeGroup).forEach(resourceData => {
                    resourceData.allocations.forEach(allocation => {
                         if (!colorMap[allocation.clientId]) {
                              colorMap[allocation.clientId] = colors[colorIndex % colors.length];
                              colorIndex++;
                         }
                    });
               });
          });

          return colorMap;
     }, [groupedAllocations]);

     return (
          <div className="timeline">
               <div className="timeline-header">
                    <div className="resource-labels-header">Resource</div>
                    <div className="timeline-days">
                         {yearDays.map((date, i) => {
                              const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
                              const month = date.getMonth() + 1;
                              const day = date.getDate();

                              return (
                                   <div key={i} className="day-label" title={date.toLocaleDateString()}>
                                        <div className="day-date">{month}/{day}</div>
                                        <div className="day-name">{dayOfWeek}</div>
                                   </div>
                              );
                         })}
                    </div>
               </div>

               <div className="timeline-body">
                    {Object.entries(groupedAllocations).length === 0 ? (
                         <div className="no-data">No allocations found for selected filters</div>
                    ) : (
                         Object.entries(groupedAllocations).map(([resourceType, resourcesInType]) => (
                              <div key={resourceType} className="resource-type-group">
                                   <div className="resource-type-header">{resourceType}</div>

                                   {Object.entries(resourcesInType).map(([resourceId, resourceData]) => {
                                        const { lanes, maxLanes } = calculateLanes(resourceData.allocations);
                                        const rowHeight = maxLanes * 50; // 50px per lane

                                        return (
                                             <div key={resourceId} className="resource-row" style={{ minHeight: `${rowHeight}px` }}>
                                                  <div className="resource-label" style={{ minHeight: `${rowHeight}px` }}>
                                                       {resourceData.resourceName}
                                                  </div>
                                                  <div className="timeline-bars" style={{ minHeight: `${rowHeight}px` }}>
                                                       {lanes.map((laneAllocations, laneIndex) => (
                                                            <div key={laneIndex} className="timeline-lane" style={{ top: `${laneIndex * 50}px` }}>
                                                                 {laneAllocations.map(allocation => {
                                                                      const position = getMilestonePosition(allocation);
                                                                      if (!position) return null;

                                                                      return (
                                                                           <div
                                                                                key={allocation.id}
                                                                                className="milestone-bar"
                                                                                style={{
                                                                                     ...position,
                                                                                     backgroundColor: clientColors[allocation.clientId]
                                                                                }}
                                                                                title={`${allocation.clientName} - ${allocation.milestoneName}\n${allocation.startDate.toLocaleDateString()} - ${allocation.endDate.toLocaleDateString()}`}
                                                                           >
                                                                                <span className="milestone-label">
                                                                                     {allocation.clientName.substring(0, 15)}... - {allocation.milestoneName}
                                                                                </span>
                                                                           </div>
                                                                      );
                                                                 })}
                                                            </div>
                                                       ))}
                                                  </div>
                                             </div>
                                        );
                                   })}
                              </div>
                         ))
                    )}
               </div>
          </div>
     );
};

export default ResourceAllocationDashboard;