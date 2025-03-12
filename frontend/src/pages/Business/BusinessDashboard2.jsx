import BusinessChatBot from "../../components/BusinessChatBot";
import MarketingStrategy from "../../components/MarketingStrategy";
import ModernNavbar from "../../components/ModernNavbar";
import ProductPlan from "../../components/ProductPlan";

const NAV_LINKS = {
  business: {
    jobs: "/business/dashboard/jobs",
    posts: "/business/dashboard/post",
    requests: "/business/dashboard/requests",
    ongoing: "/business/dashboard/ongoing",
  },
  creator: {
    jobs: "/creator/dashboard/jobs",
    posts: "/creator/dashboard/post",
    requests: "/creator/dashboard/requests",
    ongoing: "/creator/dashboard/ongoing",
  },
};

// Get the user role from localStorage
const userType = localStorage.getItem("role");

// Determine the appropriate links based on the user role
const userLinks = userType === "business" ? NAV_LINKS.business : NAV_LINKS.creator;

const BusinessDashboard2 = () => {
  return (
    
    <div>
      {/* Navbar */}
      <ModernNavbar {...userLinks} />
      
      {/* Main Content */}
      <div className="pt-16 min-h-screen bg-[#081A42]">
        {/* Marketing Strategy Section */}
        <div className="mx-auto px-4 py-8 " >
          <MarketingStrategy />
        </div>
        
        {/* Side-by-Side Chat and Product Plan with adjusted widths */}
        <div className=" max-w-7xl mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Chat component - narrower (5/12 columns) */}
          <div className="rounded-lg shadow-md p-6 md:col-span-4 bg-white">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 bg-white"></h2>
            <div className="overflow-y-auto h-[400px] bg-white">
              <BusinessChatBot />
            </div>
          </div>
          
          {/* Product Plan component - wider (7/12 columns) */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800"></h2>
            <div className="overflow-y-auto h-[400px]">
              <ProductPlan />
            </div>
          </div>
        </div>
      </div>
    </div>
     
  );
};

export default BusinessDashboard2;