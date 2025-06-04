'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  ExclamationTriangleIcon, 
  XMarkIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning', 'danger', 'info'
  requiresTyping = false,
  typingConfirmation = '',
  steps = []
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => {
    if (isProcessing) return;
    setCurrentStep(0);
    setTypedText('');
    onClose();
  };

  const handleNext = () => {
    // Check if current step requires typing confirmation
    if (currentStepData.requiresTyping && typedText !== currentStepData.typingConfirmation) {
      return; // Don't proceed if typing doesn't match
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTypedText(''); // Reset typed text for next step
    } else {
      handleConfirm();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirm = async () => {
    if (requiresTyping && typedText !== typingConfirmation) {
      return;
    }
    
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
      handleClose();
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  const currentStepData = steps.length > 0 ? steps[currentStep] : {
    title: title,
    message: message,
    confirmText: confirmText
  };

  const isTypingValid = !currentStepData.requiresTyping || typedText === currentStepData.typingConfirmation;
  const canProceed = isTypingValid && !isProcessing;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={handleClose}
                    disabled={isProcessing}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                    type === 'danger' ? 'bg-red-100' : type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {type === 'danger' ? (
                      <ShieldExclamationIcon className={`h-6 w-6 ${getIconColor()}`} aria-hidden="true" />
                    ) : (
                      <ExclamationTriangleIcon className={`h-6 w-6 ${getIconColor()}`} aria-hidden="true" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      {currentStepData.title}
                    </Dialog.Title>
                    
                    {steps.length > 1 && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Step {currentStep + 1} of {steps.length}</span>
                          <div className="flex space-x-1">
                            {steps.map((_, index) => (
                              <div
                                key={index}
                                className={`h-2 w-2 rounded-full ${
                                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <div className="text-sm text-gray-500 whitespace-pre-line">
                        {currentStepData.message}
                      </div>

                      {currentStepData.requiresTyping && (
                        <div className="mt-4">
                          <label htmlFor="confirmation-input" className="block text-sm font-medium text-gray-700 mb-2">
                            Type "{currentStepData.typingConfirmation}" to confirm:
                          </label>
                          <input
                            id="confirmation-input"
                            type="text"
                            value={typedText}
                            onChange={(e) => setTypedText(e.target.value)}
                            className={`block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${
                              typedText && typedText !== currentStepData.typingConfirmation
                                ? 'ring-red-300 focus:ring-red-600 bg-red-50'
                                : typedText === currentStepData.typingConfirmation
                                ? 'ring-green-300 focus:ring-green-600 bg-green-50'
                                : 'ring-gray-300 focus:ring-blue-600'
                            }`}
                            placeholder={currentStepData.typingConfirmation}
                            disabled={isProcessing}
                            autoComplete="off"
                          />
                          {typedText && typedText !== currentStepData.typingConfirmation && (
                            <p className="mt-1 text-sm text-red-600 font-medium">
                              ❌ Text does not match. Please type exactly: "{currentStepData.typingConfirmation}"
                            </p>
                          )}
                          {typedText === currentStepData.typingConfirmation && (
                            <p className="mt-1 text-sm text-green-600 font-medium">
                              ✅ Confirmation text matches
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto transition-all ${
                      !canProceed
                        ? 'opacity-50 cursor-not-allowed bg-gray-400'
                        : getButtonColor()
                    }`}
                    onClick={handleNext}
                    disabled={!canProceed}
                    title={!isTypingValid ? 'Please type the confirmation text exactly as shown' : ''}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : currentStep < steps.length - 1 ? (
                      'Next'
                    ) : (
                      currentStepData.confirmText || confirmText
                    )}
                  </button>
                  
                  {currentStep > 0 && (
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={handlePrevious}
                      disabled={isProcessing}
                    >
                      Previous
                    </button>
                  )}
                  
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={handleClose}
                    disabled={isProcessing}
                  >
                    {cancelText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
