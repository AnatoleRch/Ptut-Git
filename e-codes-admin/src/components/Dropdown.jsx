import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Dropdown = ({
  className,
  items,
  value,
  placeholder,
  callback,
  filtered = true,
}) => {
  // Sample data for the dropdown
  //   const items = [
  //     'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
  //     'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon',
  //     'Mango', 'Nectarine', 'Orange', 'Papaya', 'Quince'
  //   ];

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState(items);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter items based on input
  useEffect(() => {
    if (filtered) {
      const filtered = items.filter((item) => {
        const value = item.name || item;
        //item.toLowerCase().includes(inputValue.toLowerCase())
        return value.toLowerCase().includes(inputValue.toLowerCase())
      });
      setFilteredItems(filtered);
    }
  }, [inputValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleItemClick = (item) => {
    setInputValue(item.name ? item.name : item);
    callback && callback(item);
    setIsOpen(false);
  };

  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  return (
    <div className={className}>
      <div className="relative">
        {/* Input field */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            className="w-full p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder={placeholder}
          />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Dropdown menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.1 }}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-y-auto"
            >
              {/* Filtered Items */}
              {filteredItems.length > 0 ? (
                <ul className="py-1 border-b border-gray-200">
                  {filteredItems.map((item, index) => (
                    <motion.li
                      key={`match-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleItemClick(item)}
                      className="px-4 py-2 text-gray-800 hover:bg-blue-100 cursor-pointer"
                    >
                      {item.name ?? item}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-gray-500">No matches found</div>
              )}

              {/* Remaining Unmatched Items */}
              {/* {filtered && items.length > filteredItems.length && (
                <div className="px-4 py-2 text-xs text-gray-500 uppercase tracking-wide bg-gray-50">
                  Other options
                </div>
              )} */}

              {filtered && items.length > filteredItems.length && (
                <>
                  <hr className="border-slate-50/60"/>
                  <ul className="py-1">
                    {items
                      .filter(
                        (item) =>
                          item.name ? (
                            !filteredItems.find((d) => d.name === item.name) &&
                            item.name.toLowerCase() !== inputValue.toLowerCase()
                          ) : (
                          !filteredItems.includes(item) &&
                          item.toLowerCase() !== inputValue.toLowerCase()
                          )
                      )
                      .map((item, index) => (
                        <motion.li
                          key={`rest-${index}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => handleItemClick(item)}
                          className="px-4 py-2 text-gray-600 hover:bg-blue-50 cursor-pointer list-none"
                        >
                          {item.name ?? item}
                        </motion.li>
                      ))}
                  </ul>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dropdown;
