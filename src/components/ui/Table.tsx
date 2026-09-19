import {
  type TableHTMLAttributes,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
  type ReactNode,
} from 'react';

export function TableWrapper({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`ui-table-wrapper ${className}`}>{children}</div>;
}

export function Table({
  density = 'md',
  hover = true,
  striped = false,
  className = '',
  children,
  ...props
}: TableHTMLAttributes<HTMLTableElement> & {
  density?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  striped?: boolean;
}) {
  const classes = [
    'ui-table',
    `ui-table--${density}`,
    hover ? 'ui-table--hover' : '',
    striped ? 'ui-table--striped' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <table className={classes} {...props}>
      {children}
    </table>
  );
}

export function TableHead({ children, className = '', ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={`ui-table__head ${className}`} {...props}>{children}</thead>;
}

export function TableBody({ children, className = '', ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={`ui-table__body ${className}`} {...props}>{children}</tbody>;
}

export function TableRow({ children, className = '', isSelected = false, ...props }: HTMLAttributes<HTMLTableRowElement> & { isSelected?: boolean }) {
  return (
    <tr className={`ui-table__row ${isSelected ? 'is-selected' : ''} ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHeaderCell({ children, textAlign = 'start', className = '', ...props }: Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> & { textAlign?: 'start' | 'center' | 'end' }) {
  return (
    <th className={`ui-table__th ui-table__cell--align-${textAlign} ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, textAlign = 'start', className = '', ...props }: Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> & { textAlign?: 'start' | 'center' | 'end' }) {
  return (
    <td className={`ui-table__td ui-table__cell--align-${textAlign} ${className}`} {...props}>
      {children}
    </td>
  );
}
