
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-gray-600 mb-4">העמוד לא נמצא</p>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          מצטערים, הדף המבוקש אינו קיים או שהוא הוסר.
        </p>
        <Link to="/">
          <Button className="hover-lift focus-ring">
            חזרה לעמוד הראשי
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
