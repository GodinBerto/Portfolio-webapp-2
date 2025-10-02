export default function BuilderRightSidebar() {
  return (
    <div className="h-full w-full bg-gray-50 dark:bg-semiblack border-l border-gray-300 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Properties
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Select an element on the canvas to view and edit its properties.
      </p>
      {/* Add more UI elements for properties as needed */}
    </div>
  );
}
