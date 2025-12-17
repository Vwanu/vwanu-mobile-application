import React, { useState } from 'react'
import InvitationList from './invitationList'
import SendInvitation from './sendInvitation'

const InvitationsTab: React.FC<TabInterFace> = ({ communityId, onError }) => {
  const [isSelectingUsers, setIsSelectingUsers] = useState(false)

  const handleCreateInvitation = () => {
    setIsSelectingUsers(true)
  }

  const handleCancelSelection = () => {
    setIsSelectingUsers(false)
  }

  const handleSendInvitations = (userIds: string[]) => {
    console.log('Sending invitations to:', userIds)
    // TODO: Implement API call to send invitations
    // For now, just close the selection view
    setIsSelectingUsers(false)
  }

  return isSelectingUsers ? (
    <SendInvitation
      communityId={communityId}
      onCancel={handleCancelSelection}
      onSendInvitations={handleSendInvitations}
      onError={onError}
    />
  ) : (
    <InvitationList
      communityId={communityId}
      onCreateInvitation={handleCreateInvitation}
      onError={onError}
    />
  )
}

export default InvitationsTab
