import { Modal as BsModal } from 'react-bootstrap'

export default function Modal({ show, onClose, title, children, footer }) {
  return (
    <BsModal show={show} onHide={onClose} centered>
      {title && (
        <BsModal.Header closeButton className="!border-0 !px-6 !pt-6">
          <BsModal.Title className="!text-lg !font-bold text-slate-800 dark:text-slate-100">{title}</BsModal.Title>
        </BsModal.Header>
      )}
      <BsModal.Body className="!px-6 !py-2 text-slate-600 dark:text-slate-300">{children}</BsModal.Body>
      {footer && <BsModal.Footer className="!border-0 !px-6 !pb-6">{footer}</BsModal.Footer>}
    </BsModal>
  )
}
