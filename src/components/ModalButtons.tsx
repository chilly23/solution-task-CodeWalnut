interface ModalButtonsProps {
  oncancel: () => void;
  isvalid: boolean;
  submitlabel?: string;
}

export const ModalButtons = ({ oncancel, isvalid, submitlabel = 'submit' }: ModalButtonsProps) => (
  <div className="flex justify-end gap-3 pt-4 border-t">
    <button
      type="button"
      onClick={oncancel}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
    >
      cancel
    </button>
    <button
      type="submit"
      className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
        isvalid ? 'bg-green-600 hover:bg-green-700' : 'bg-green-400 cursor-not-allowed'
      }`}
      disabled={!isvalid}
    >
      {submitlabel}
    </button>
  </div>
);
