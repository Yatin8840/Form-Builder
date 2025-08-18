import React from "react";
type Props = React.SelectHTMLAttributes<HTMLSelectElement>;
export default function Select(props: Props) {
  return <select className="input" {...props} />;
}
