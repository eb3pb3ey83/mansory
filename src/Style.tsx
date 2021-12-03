import React from "react";

export const Style = React.memo(({ children }) => {
  return <style>{children}</style>
})