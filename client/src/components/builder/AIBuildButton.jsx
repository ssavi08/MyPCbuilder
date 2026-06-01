import useStore from '../../store/useStore'
import './AIBuildButton.css'

export default function AIBuildButton() {
  const generateBuild = useStore(s => s.generateBuild)
  const buildLoading  = useStore(s => s.buildLoading)
  const buildError    = useStore(s => s.buildError)
  const useCase       = useStore(s => s.useCase)

  return (
    <div className="ai-build-section">
      <button
        className={`ai-build-btn ${buildLoading ? 'loading' : ''}`}
        onClick={generateBuild}
        disabled={buildLoading}
      >
        {buildLoading ? (
          <>
            <span className="spinner" />
            Generating...
          </>
        ) : (
          <>
            <span>🤖</span>
            Generate AI Build
          </>
        )}
      </button>

      {buildLoading && (
        <p className="ai-loading-text">
          AI is selecting the best components for your {useCase} build...
        </p>
      )}

      {buildError && (
        <div className="ai-error">
          <span>⚠️</span>
          <p>{buildError}</p>
        </div>
      )}
    </div>
  )
}
