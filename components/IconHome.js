
import React, { useState, useEffect } from 'react';
const BadgeContext = React.createContext();

class HomeIconWithBadge extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      badge: 0
    }
  }

  // This Method is Called every time when Bagde Value need to Update in Dashboard and Notification Page 

  updateBadge = (num) => {

    this.setState({ badge: num })

  }

  // and Get the Updated Value of badge with the help of BadgeContext.Provider
  render() {
    const { badge } = this.state;

    return (

      <BadgeContext.Provider
        value={{
          badge,
          updateBadge: this.updateBadge,
        }}
      >
        {this.props.children}
      
      </BadgeContext.Provider>
    )
  };
}

export { HomeIconWithBadge, BadgeContext };