

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EventTicketing is ERC721 {
    address public owner;

    struct Event {
        string name;
        string description;
        string hostName;
        uint256 noOfParticipants;
        bool paidAllowance;
        bool foodAllowed;
        address creator;
        bool needsVenue;
        string location;  // This can be an empty string if the venue is provided by us
        uint256 ticketPrice;
        uint256 ticketsSold;
    }

    uint256 public eventCounter = 0;
    mapping(uint256 => Event) public events;
    mapping(uint256 => uint256) public eventTicketCounter;
    mapping(uint256 => mapping(uint256 => address)) public eventTicketOwners;
    
    event EventCreated(
        uint256 indexed eventId,
        string name,
        string description,
        string hostName,
        uint256 noOfParticipants,
        bool paidAllowance,
        bool foodAllowed,
        address indexed creator,
        bool needsVenue,
        string location,
        uint256 ticketPrice
    );

    event TicketPurchased(
        uint256 indexed eventId,
        address indexed buyer,
        uint256 ticketId
    );

    uint256 public constant EVENT_CREATION_FEE = 4300000000000000000 wei;
    uint256 public constant VENUE_FEE = 2100000000000000000 wei;
    uint256 private _tokenIds;

    constructor() ERC721("EventTicketNFT", "ETK") {
        owner = msg.sender;
    }

    function createEvent(
        string memory _name,
        string memory _description,
        string memory _hostName,
        uint256 _noOfParticipants,
        bool _paidAllowance,
        bool _foodAllowed,
        bool _needsVenue,
        string memory _location,
        uint256 _ticketPrice
    ) public payable {
        require(bytes(_name).length > 0, "Event name is required");
        require(bytes(_description).length > 0, "Event description is required");
        require(bytes(_hostName).length > 0, "Host name is required");
        require(_noOfParticipants > 0, "Number of participants must be greater than zero");
        require(_ticketPrice > 0, "Ticket price should be mentioned and also greater than zero");

        uint256 totalFee = EVENT_CREATION_FEE;
        if (_needsVenue) {
            totalFee += VENUE_FEE;
        }

        require(msg.value >= totalFee, "Insufficient funds to create event");

        events[eventCounter] = Event({
            name: _name,
            description: _description,
            hostName: _hostName,
            noOfParticipants: _noOfParticipants,
            paidAllowance: _paidAllowance,
            foodAllowed: _foodAllowed,
            creator: msg.sender,
            needsVenue: _needsVenue,
            location: _location,
            ticketPrice: _ticketPrice,
            ticketsSold: 0
        });

        emit EventCreated(
            eventCounter,
            _name,
            _description,
            _hostName,
            _noOfParticipants,
            _paidAllowance,
            _foodAllowed,
            msg.sender,
            _needsVenue,
            _location,
            _ticketPrice
        );

        eventCounter++;
        payable(owner).transfer(totalFee);

        // Refund any excess amount sent by the user
        if (msg.value > totalFee) {
            payable(msg.sender).transfer(msg.value - totalFee);
        }
    }

    function buyTicket(uint256 eventId) public payable {
        Event storage myEvent = events[eventId];
        require(myEvent.ticketPrice > 0, "This event does not have tickets for sale");
        require(msg.value >= myEvent.ticketPrice, "Insufficient funds to purchase ticket");
        require(myEvent.ticketsSold < myEvent.noOfParticipants, "All tickets are sold out");

        uint256 ticketId = _mintTicket(msg.sender, myEvent.name);
        myEvent.ticketsSold++;
        eventTicketOwners[eventId][ticketId] = msg.sender;

        emit TicketPurchased(eventId, msg.sender, ticketId);

        // Transfer ticket price to the event creator
        payable(myEvent.creator).transfer(myEvent.ticketPrice);

        // Refund any excess amount sent by the user
        if (msg.value > myEvent.ticketPrice) {
            payable(msg.sender).transfer(msg.value - myEvent.ticketPrice);
        }
    }

    function _mintTicket(address to, string memory eventName) internal returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(to, newItemId);
        return newItemId;
    }

    function getEvents() public view returns (Event[] memory) {
        Event[] memory eventList = new Event[](eventCounter);
        for (uint256 i = 0; i < eventCounter; i++) {
            eventList[i] = events[i];
        }
        return eventList;
    }

    // New function to view the address of the ticket owner
    function viewTicketBoughtAddress(uint256 eventId, uint256 ticketId) public view returns (address) {
        return eventTicketOwners[eventId][ticketId];
    }
}
