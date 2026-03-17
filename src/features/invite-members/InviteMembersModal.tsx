import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'

type InviteMembersModalProps = {
  onClose: () => void
}

type Member = {
  id: number
  name: string
  email: string
  avatar: string
}

const initialMembers: Member[] = [
  {
    id: 1,
    name: 'Amanuel',
    email: 'amanuel@email.com',
    avatar:
      'linear-gradient(135deg, #5f452e 0%, #d9bd8a 44%, #1d2432 100%)',
  },
  {
    id: 2,
    name: 'Amanuel',
    email: 'amanuel@email.com',
    avatar:
      'linear-gradient(135deg, #9f8b64 0%, #ece5d2 45%, #657084 100%)',
  },
  {
    id: 3,
    name: 'Amanuel',
    email: 'amanuel@email.com',
    avatar:
      'linear-gradient(135deg, #39435a 0%, #8ca2b9 48%, #1a1e2b 100%)',
  },
  {
    id: 4,
    name: 'Amanuel',
    email: 'amanuel@email.com',
    avatar:
      'linear-gradient(135deg, #5f584b 0%, #d9cfbf 44%, #4e5058 100%)',
  },
]

const inviteLink = 'https://sharelinkhereandthere.com/34565yy29'

function AvatarPlaceholder({ background }: { background: string }) {
  return (
    <div
      className="invite-member__avatar"
      aria-hidden="true"
      style={{ background }}
    />
  )
}

const InviteMembersModal = ({ onClose }: InviteMembersModalProps) => {
  const [email, setEmail] = useState('amanuelbeyene662@gmail.com')
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleInvite = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim()) {
      return
    }

    const newMember: Member = {
      id: Date.now(),
      name: email.split('@')[0] || 'New Member',
      email,
      avatar:
        'linear-gradient(135deg, #884c38 0%, #d29f77 48%, #282d3c 100%)',
    }

    setMembers((current) => [newMember, ...current])
    setEmail('')
  }

  const handleCopy = async () => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(inviteLink)
    }

    setCopyState('copied')
    window.setTimeout(() => {
      setCopyState('idle')
    }, 1400)
  }

  const modal = (
    <div
      className="invite-modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="invite-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
      >
        <div className="invite-modal__header">
          <h3 className="section-title" id="invite-modal-title">
            Send an invite to a new member
          </h3>
          <button className="invite-modal__back" type="button" onClick={onClose}>
            Go Back
          </button>
        </div>

        <form className="invite-modal__email-row" onSubmit={handleInvite}>
          <label className="invite-modal__field">
            <span className="invite-modal__label">Email</span>
            <input
              className="invite-modal__input"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
              }}
              placeholder="Enter email"
            />
          </label>

          <button className="invite-modal__submit" type="submit">
            Send Invite
          </button>
        </form>

        <div className="invite-modal__members">
          <p className="invite-modal__label">Members</p>
          <div className="invite-member-list">
            {members.map((member) => (
              <div className="invite-member" key={member.id}>
                <AvatarPlaceholder background={member.avatar} />
                <div className="invite-member__info">
                  <strong>{member.name}</strong>
                  <span>{member.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="invite-modal__link-block">
          <p className="invite-modal__label">Invite Link</p>
          <div className="invite-modal__link-row">
            <input className="invite-modal__input" readOnly value={inviteLink} />
            <button className="invite-modal__submit" type="button" onClick={handleCopy}>
              {copyState === 'copied' ? 'Copied' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return document.body ? createPortal(modal, document.body) : null
}

export default InviteMembersModal
