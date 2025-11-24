import React, { useState, useMemo } from 'react';
import { Calendar, Users, Briefcase, CheckSquare } from 'lucide-react';
import './App.css';
/**
 * RESOURCE ALLOCATION DASHBOARD
 * 
 * This is a React application for managing resource allocation across client projects.
 * Perfect for learning React while building a real-world application!
 */

// ============================================================================
// DATA STRUCTURES AND MOCK DATA
// ============================================================================

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

     // Group milestones by client
     const milestonesByClient = {};
     milestones.forEach(milestone => {
          if (!milestonesByClient[milestone.clientId]) {
               milestonesByClient[milestone.clientId] = [];
          }
          milestonesByClient[milestone.clientId].push(milestone);
     });

     // For each client, assign one resource per resource type across all their milestones
     Object.keys(milestonesByClient).forEach(clientId => {
          const clientMilestones = milestonesByClient[clientId];

          // Assign one resource per resource type for this client (all 5 types)
          const clientResourceAssignments = {};

          RESOURCE_TYPES.forEach(resourceType => {
               // Find all resources with this type
               const resourcesWithType = resources.filter(r => r.types.includes(resourceType));

               if (resourcesWithType.length > 0) {
                    // Pick one random resource for this type for this client
                    const assignedResource = resourcesWithType[Math.floor(Math.random() * resourcesWithType.length)];
                    clientResourceAssignments[resourceType] = assignedResource;
               }
          });

          // Now assign these resources to all milestones for this client
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

// ============================================================================
// REACT COMPONENTS
// ============================================================================

const ResourceAllocationDashboard = () => {
     const resources = useMemo(() => generateResources(), []);
     const clients = useMemo(() => generateClients(), []);
     const milestones = useMemo(() => generateProjectMilestones(clients), [clients]);
     const allocations = useMemo(() => generateResourceAllocations(resources, milestones), [resources, milestones]);

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

     return (
          <div className="dashboard">
               <header className="dashboard-header">
                    <h1>Resource Allocation Dashboard</h1>
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

                                   {Object.entries(resourcesInType).map(([resourceId, resourceData]) => (
                                        <div key={resourceId} className="resource-row">
                                             <div className="resource-label">{resourceData.resourceName}</div>
                                             <div className="timeline-bars">
                                                  {resourceData.allocations.map(allocation => {
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
                                        </div>
                                   ))}
                              </div>
                         ))
                    )}
               </div>
          </div>
     );
};

export default ResourceAllocationDashboard;